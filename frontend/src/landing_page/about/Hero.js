import React from "react";

function Hero() {
  return (
    <div className="container">
      <div className="row p-5 mt-5 mb-5">
        <h1 className="fs-2 text-center">
          Aiota makes trading-system engineering tangible.
          <br />
          Practice the workflow. Understand the architecture.
        </h1>
      </div>

      <div
        className="row p-5 mt-5 border-top text-muted"
        style={{ lineHeight: "1.8", fontSize: "1.2em" }}
      >
        <div className="col-6 p-5">
          <p>
            Aiota is a full-stack trading simulator created as an engineering project. It gives every user virtual cash, a personal portfolio, simulated instruments, and server-controlled trade execution.
          </p>
          <p>
            It is not a broker and it never places real-market orders. The goal is to demonstrate well-designed frontend, backend, API, database, security, and testing practices.
          </p>
          <p>
            Each order is validated on the backend, recorded in an immutable transaction history, and reflected in virtual cash and holdings.
          </p>
        </div>
        <div className="col-6 p-5">
          <p>
            The first version focuses on the essentials: authentication, watchlists, holdings, funds, instant market buy/sell orders, and portfolio calculations.
          </p>
          <p>
            <a href="http://localhost:3001" style={{ textDecoration: "none" }}>
              Launch the simulator
            </a>
            , create a virtual account, and explore the full trade lifecycle without financial risk.
          </p>
          <p>
            Aiota starts as a modular monolith and evolves only when a real technical need justifies it.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Hero;
