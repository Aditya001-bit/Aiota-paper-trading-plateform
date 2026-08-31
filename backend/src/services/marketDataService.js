const Instrument = require("../models/Instrument");
const PriceSnapshot = require("../models/PriceSnapshot");
const { ApiError } = require("../utils/api");

let timer;
const CHART_RANGES = {
  "1D": { interval: "5min", outputsize: 100, cacheMs: 24 * 60 * 60 * 1000 },
  "1W": { interval: "1h", outputsize: 42, cacheMs: 8 * 24 * 60 * 60 * 1000 },
  "1M": { interval: "1day", outputsize: 31, cacheMs: 32 * 24 * 60 * 60 * 1000 },
  "3M": { interval: "1day", outputsize: 93, cacheMs: 94 * 24 * 60 * 60 * 1000 },
};
const provider = () => (process.env.MARKET_DATA_PROVIDER || "SIMULATED").toUpperCase();
const toPaise = (value) => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? Math.round(number * 100) : null;
};

async function status() {
  const latest = await Instrument.findOne({ marketDataSource: "TWELVE_DATA" }).sort({ quoteUpdatedAt: -1 }).lean();
  const age = latest?.quoteUpdatedAt ? Date.now() - new Date(latest.quoteUpdatedAt).getTime() : null;
  const maxStalenessMs = Number(process.env.MARKET_DATA_MAX_STALENESS_MS || 120000);
  return { provider: provider(), isConfigured: provider() !== "TWELVE_DATA" || Boolean(process.env.TWELVE_DATA_API_KEY), quoteUpdatedAt: latest?.quoteUpdatedAt || null, quoteAgeMs: age, hasFreshLiveQuote: provider() === "TWELVE_DATA" && age !== null && age <= maxStalenessMs };
}

async function getJson(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
  const body = await response.json();
  if (!response.ok || body.status === "error") throw new Error(body.message || `Market data HTTP ${response.status}`);
  return body;
}

async function refreshTwelveDataQuotes() {
  if (!process.env.TWELVE_DATA_API_KEY) throw new Error("TWELVE_DATA_API_KEY is required");
  const instruments = await Instrument.find().lean();
  const url = new URL("https://api.twelvedata.com/quote");
  url.searchParams.set("symbol", instruments.map((item) => `${item.symbol}:${item.exchange}`).join(","));
  url.searchParams.set("apikey", process.env.TWELVE_DATA_API_KEY);
  const quotes = Object.values(await getJson(url));
  let updated = 0;
  await Promise.all(quotes.map(async (quote) => {
    const symbol = String(quote.symbol || "").toUpperCase();
    const instrument = instruments.find((item) => item.symbol === symbol);
    const pricePaise = toPaise(quote.close || quote.price);
    if (!instrument || !pricePaise) return;
    const previousClosePaise = toPaise(quote.previous_close);
    await Instrument.updateOne({ _id: instrument._id }, { $set: { currentPricePaise: pricePaise, ...(previousClosePaise && { previousClosePaise }), marketDataSource: "TWELVE_DATA", quoteUpdatedAt: new Date() } });
    await PriceSnapshot.create({ instrument: instrument._id, pricePaise, source: "TWELVE_DATA" });
    updated += 1;
  }));
  if (!updated) throw new Error("No usable Twelve Data quotes returned");
  return { updated };
}

async function cachedHistory(instrument, range) {
  const from = new Date(Date.now() - range.cacheMs);
  const points = await PriceSnapshot.find({ instrument: instrument._id, createdAt: { $gte: from } }).sort({ createdAt: 1 }).limit(range.outputsize).lean();
  return points.length > 1 ? points : PriceSnapshot.find({ instrument: instrument._id }).sort({ createdAt: 1 }).limit(range.outputsize).lean();
}

function simulatedHistory(instrument, rangeKey) {
  const settings = { "1D": [78, 6.5 * 60 * 60 * 1000], "1W": [35, 7 * 24 * 60 * 60 * 1000], "1M": [31, 30 * 24 * 60 * 60 * 1000], "3M": [91, 90 * 24 * 60 * 60 * 1000] }[rangeKey];
  const [count, durationMs] = settings;
  const current = instrument.currentPricePaise;
  const opening = instrument.previousClosePaise || current;
  const seed = Array.from(instrument.symbol).reduce((total, char) => total + char.charCodeAt(0), 0);
  const amplitude = Math.max(20, Math.round(current * (0.006 + (seed % 7) / 1000)));
  const end = Date.now();
  return Array.from({ length: count }, (_, index) => {
    const progress = index / (count - 1);
    const trend = (current - opening) * progress;
    const wave = Math.sin(progress * Math.PI * (2 + (seed % 3))) * amplitude * Math.sin(progress * Math.PI);
    return { pricePaise: Math.max(1, Math.round(opening + trend + wave)), createdAt: new Date(end - durationMs + durationMs * progress) };
  });
}

async function getChartHistory(instrument, rangeKey) {
  const range = CHART_RANGES[rangeKey];
  if (!range) throw new ApiError(422, "Choose a valid chart range", "VALIDATION_ERROR");
  if (provider() === "SIMULATED") {
    return { points: simulatedHistory(instrument, rangeKey), source: "SIMULATED", message: "Generated from Aiota’s deterministic learning-market model." };
  }
  if (provider() === "TWELVE_DATA" && process.env.TWELVE_DATA_API_KEY) {
    try {
      const url = new URL("https://api.twelvedata.com/time_series");
      url.searchParams.set("symbol", `${instrument.symbol}:${instrument.exchange}`);
      url.searchParams.set("interval", range.interval);
      url.searchParams.set("outputsize", String(range.outputsize));
      url.searchParams.set("apikey", process.env.TWELVE_DATA_API_KEY);
      const body = await getJson(url);
      const points = (body.values || []).map((candle) => ({ pricePaise: toPaise(candle.close), createdAt: new Date(candle.datetime) })).filter((point) => point.pricePaise && !Number.isNaN(point.createdAt.getTime())).sort((a, b) => a.createdAt - b.createdAt);
      if (points.length > 1) return { points, source: "TWELVE_DATA" };
      return { points: [], source: "UNAVAILABLE", message: "Twelve Data did not return enough historical candles for this range." };
    } catch (error) {
      console.warn("Chart data unavailable; using stored prices", { symbol: instrument.symbol, range: rangeKey, message: error.message });
      return { points: [], source: "UNAVAILABLE", message: "Live chart history is unavailable from Twelve Data for this instrument and range." };
    }
  }
  const cached = await cachedHistory(instrument, range);
  return cached.length > 1
    ? { points: cached, source: "SIMULATED" }
    : { points: simulatedHistory(instrument, rangeKey), source: "SIMULATED", message: "Simulated learning history — generated from Aiota’s deterministic market model." };
}

async function historyCapabilities(instrument) {
  if (provider() !== "TWELVE_DATA" || !process.env.TWELVE_DATA_API_KEY) return { provider: provider(), configured: false, ranges: [] };
  const tests = Object.entries(CHART_RANGES);
  const ranges = await Promise.all(tests.map(async ([range, config]) => {
    try {
      const url = new URL("https://api.twelvedata.com/time_series");
      url.searchParams.set("symbol", `${instrument.symbol}:${instrument.exchange}`);
      url.searchParams.set("interval", config.interval);
      url.searchParams.set("outputsize", String(config.outputsize));
      url.searchParams.set("apikey", process.env.TWELVE_DATA_API_KEY);
      const body = await getJson(url);
      const candles = Array.isArray(body.values) ? body.values : [];
      return { range, interval: config.interval, requestedPoints: config.outputsize, receivedPoints: candles.length, oldest: candles.at(-1)?.datetime || null, newest: candles[0]?.datetime || null, available: candles.length > 1 };
    } catch (error) {
      return { range, interval: config.interval, requestedPoints: config.outputsize, receivedPoints: 0, available: false, error: error.message };
    }
  }));
  return { provider: "TWELVE_DATA", configured: true, symbol: instrument.symbol, ranges };
}

async function populateHistory(instrument) { return (await getChartHistory(instrument, "1M")).points; }
async function refreshMarketData() { return provider() === "TWELVE_DATA" ? refreshTwelveDataQuotes() : { skipped: true }; }
function startMarketDataPolling() {
  if (provider() !== "TWELVE_DATA") return null;
  const run = () => refreshMarketData().catch((error) => console.error("Market-data refresh failed", error.message));
  run();
  if (!timer) timer = setInterval(run, Number(process.env.MARKET_DATA_REFRESH_MS || 60000));
  return timer;
}
async function assertTradablePrice(instrument) {
  if (provider() !== "TWELVE_DATA") return;
  const age = instrument.quoteUpdatedAt ? Date.now() - instrument.quoteUpdatedAt.getTime() : Infinity;
  if (age > Number(process.env.MARKET_DATA_MAX_STALENESS_MS || 120000)) throw new ApiError(503, "Live market quote is unavailable or stale", "MARKET_DATA_UNAVAILABLE");
}
module.exports = { status, refreshMarketData, startMarketDataPolling, assertTradablePrice, populateHistory, getChartHistory, historyCapabilities };
