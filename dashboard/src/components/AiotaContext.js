import React, { createContext, useCallback, useEffect, useState } from "react";
import { api, setAccessToken } from "../services/api";

export const AiotaContext = createContext(null);
const sessionKey = "aiota.accessToken";
export function AiotaProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem(sessionKey)); const [user, setUser] = useState(null); const [portfolio, setPortfolio] = useState(null); const [watchlist, setWatchlist] = useState([]); const [error, setError] = useState(""); const [loading, setLoading] = useState(false); const [toast, setToast] = useState(null);
  const notify = useCallback((message, type = "success") => { setToast({ message, type }); }, []);
  const logout = useCallback((message) => { sessionStorage.removeItem(sessionKey); setAccessToken(null); setToken(null); setUser(null); setPortfolio(null); setWatchlist([]); if (message) notify(message, "error"); }, [notify]);
  useEffect(() => { setAccessToken(token); }, [token]);
  useEffect(() => { if (!token) return; api.me().then((response) => setUser(response.data.data.user)).catch(() => logout("Your session expired. Please sign in again.")); }, [token, logout]);
  const refresh = useCallback(async (silent = false) => { if (!token) return; if (!silent) setLoading(true); try { const [portfolioResponse, watchlistResponse] = await Promise.all([api.portfolio(), api.watchlist()]); setPortfolio(portfolioResponse.data.data.portfolio); setWatchlist(watchlistResponse.data.data.watchlist); setError(""); } catch (err) { if (err.response?.status === 401) logout("Your session expired. Please sign in again."); else setError(err.response?.data?.error?.message || "Unable to load dashboard data"); } finally { if (!silent) setLoading(false); } }, [token, logout]);
  useEffect(() => { refresh(); }, [refresh]);
  useEffect(() => { if (!token) return undefined; const timer = setInterval(() => refresh(true), 30000); return () => clearInterval(timer); }, [token, refresh]);
  useEffect(() => { if (!toast) return undefined; const timer = setTimeout(() => setToast(null), 4000); return () => clearTimeout(timer); }, [toast]);
  const authenticate = async (method, form) => { const response = await api[method](form); const data = response.data.data; sessionStorage.setItem(sessionKey, data.accessToken); setAccessToken(data.accessToken); setToken(data.accessToken); setUser(data.user); notify(method === "signup" ? "Virtual account created. Welcome to Aiota." : "Signed in successfully."); };
  const trade = async (payload) => { const response = await api.trade(payload); await refresh(true); notify(`${payload.side === "BUY" ? "Bought" : "Sold"} ${payload.quantity} ${payload.symbol} at server price.`); return response.data.data.order; };
  const addWatchlist = async (symbol) => { await api.addWatchlist(symbol); await refresh(true); notify(`${symbol} added to watchlist.`); };
  const removeWatchlist = async (symbol) => { await api.removeWatchlist(symbol); await refresh(true); notify(`${symbol} removed from watchlist.`); };
  return <AiotaContext.Provider value={{ token, user, portfolio, watchlist, error, loading, toast, authenticate, logout, refresh, trade, addWatchlist, removeWatchlist }}>{children}</AiotaContext.Provider>;
}
