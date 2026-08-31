import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";

import Apps from "./Apps";
import Funds from "./Funds";
import Holdings from "./Holdings";

import Orders from "./Orders";
import Positions from "./Positions";
import Summary from "./Summary";
import WatchList from "./WatchList";
import StockDetail from "./StockDetail";
import { AiotaContext } from "./AiotaContext";

const Dashboard = () => {
  const { error, loading } = useContext(AiotaContext);
  return (
    <div className="dashboard-container">
      <WatchList />
      <div className="content">
        {error && <p className="loss">{error}</p>}
        {loading && <p>Refreshing market data…</p>}
        <Routes>
          <Route exact path="/" element={<Summary />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/holdings" element={<Holdings />} />
          <Route path="/positions" element={<Positions />} />
          <Route path="/funds" element={<Funds />} />
          <Route path="/apps" element={<Apps />} />
          <Route path="/instrument/:symbol" element={<StockDetail />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
