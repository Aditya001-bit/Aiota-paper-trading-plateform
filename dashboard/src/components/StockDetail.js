import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler } from "chart.js";
import { api } from "../services/api";
import TradeModal from "./TradeModal";
import { AiotaContext } from "./AiotaContext";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);
const ranges = ["1D", "1W", "1M", "3M"];

export default function StockDetail() {
  const { symbol } = useParams();
  const { trade } = React.useContext(AiotaContext);
  const [data, setData] = useState(null);
  const [range, setRange] = useState("1M");
  const [side, setSide] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    setData(null); setError("");
    api.getInstrumentHistory(symbol, range).then((response) => setData(response.data.data)).catch((err) => setError(err.response?.data?.error?.message || "Unable to load chart data"));
  }, [symbol, range]);
  if (error) return <p className="loss">{error}</p>;
  if (!data) return <p>Loading {range} chart…</p>;
  const { current, history } = data;
  const points = history;
  const isIntraday = range === "1D";
  const formatLabel = (at) => new Date(at).toLocaleString([], isIntraday ? { hour: "2-digit", minute: "2-digit" } : { month: "short", day: "numeric" });
  const positive = current.dayChangePaise >= 0;
  const chart = { labels: points.map((point) => formatLabel(point.at)), datasets: [{ label: current.symbol + " price", data: points.map((point) => point.pricePaise / 100), borderColor: positive ? "#16a34a" : "#ef4444", backgroundColor: positive ? "rgba(22,163,74,.10)" : "rgba(239,68,68,.10)", fill: true, stepped: "before", pointRadius: points.length > 60 ? 0 : 3, pointHoverRadius: 5, pointBackgroundColor: positive ? "#16a34a" : "#ef4444", borderWidth: 2 }] };
  return <section className="stock-detail">
    <Link to="/">← Back to dashboard</Link>
    <p className="market-status">{current.isLive ? "Live price feed" : "Simulated price feed"}</p>
    <h1>{current.symbol}</h1><p>{current.companyName} · {current.exchange}</p>
    <h2>₹{(current.currentPricePaise / 100).toFixed(2)} <small className={positive ? "up" : "down"}>{current.dayChangePercent}% today</small></h2>
    <div className="chart-toolbar" aria-label="Chart range">{ranges.map((item) => <button key={item} className={range === item ? "chart-range active" : "chart-range"} onClick={() => setRange(item)}>{item}</button>)}</div>
    {data.historySource === "SIMULATED" && <p className="chart-notice">Simulated learning chart: {data.historyMessage || "Aiota does not use live market data."}</p>}
    {points.length > 1 ? <div className="chart-wrap"><Line data={chart} options={{ responsive: true, maintainAspectRatio: false, interaction: { intersect: false, mode: "index" }, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context) => "₹" + Number(context.raw).toFixed(2) } } }, scales: { x: { grid: { display: false }, ticks: { maxTicksLimit: isIntraday ? 7 : 8 } }, y: { ticks: { callback: (value) => "₹" + value } } } }} /></div> : <div className="chart-unavailable"><strong>History unavailable for {range}</strong><p>{data.historyMessage || "No verified chart history is available yet."}</p><p>Aiota will not draw fake prices. Try another range or check your Twelve Data plan.</p></div>}
    <div className="beginner-card"><h3>For beginners</h3><p>Choose a range to compare price movement. Each dot is a recorded market price; virtual orders still execute using Aiota’s latest server price.</p></div>
    <button className="buy detail-button" onClick={() => setSide("BUY")}>Buy virtual shares</button><button className="sell detail-button" onClick={() => setSide("SELL")}>Sell shares</button>
    {side && <TradeModal stock={current} side={side} onClose={() => setSide(null)} onSubmit={trade} />}
  </section>;
}
