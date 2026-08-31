import React from "react";
import { dashboardUrl } from "../../config";

function Hero() {
  return (
    <section className="aiota-hero">
      <div className="container">
      <div className="row align-items-center">
        <div className="col-md-6 text-start py-5">
        <span className="aiota-eyebrow">VIRTUAL TRADING SIMULATOR</span>
        <h1>Learn the markets by building your confidence.</h1>
        <p>Aiota is a risk-free stock-market simulator with virtual cash, live-style prices, and an auditable portfolio.</p>
        <a className="btn aiota-primary" href={dashboardUrl}>Launch simulator</a>
        <p className="aiota-disclaimer">No real money. No broker connection. Built for learning.</p>
        </div>
        <div className="col-md-6">
        <img
          src="media/images/aiota-hero.png"
          alt="Aiota virtual trading dashboard"
          className="img-fluid"
        />
        </div>
      </div>
      </div></section>
  );
}

export default Hero;
