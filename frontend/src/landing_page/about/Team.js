import React from "react";

function Team() {
  return (
    <div className="container">
      <div className="row p-3 mt-5 border-top">
        <h1 className="text-center ">Meet the builder</h1>
      </div>

      <div
        className="row p-3 text-muted"
        style={{ lineHeight: "1.8", fontSize: "1.2em" }}
      >
        <div className="col-6 p-3 text-center">
          <img
            src="/assets/dev_Aditya.jpg"
            alt="Aditya Kasaudhan"
            style={{ borderRadius: "100%", width: "50%" }}
          />
          <h4 className="mt-5">Aditya Kasaudhan</h4>
          <h6>Creator of Aiota</h6>
        </div>
        <div className="col-6 p-3">
          <p>
            I am a Computer Science and Engineering student at Inderprastha Engineering College, building full-stack products with React, Node.js, Express, MongoDB, and REST APIs.
          </p>
          <p>
            I created Aiota to turn a trading-platform clone into an engineering project: a safe virtual trading environment where users can learn buy/sell workflows, portfolio management, and full-stack system design.
          </p>
          <p>The project emphasizes correctness, data modeling, API design, authentication, and testable business logic—not real-money trading.</p>
          <p>
            Connect on <a href="https://github.com/Aditya001-bit">GitHub</a> / <a href="https://linkedin.com/in/aditya-kasaudhan-92676121b/">LinkedIn</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Team;
