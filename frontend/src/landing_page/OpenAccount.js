import React from "react";
import { dashboardUrl } from "../config";

function OpenAccount() {
  return (
    <div className="container p-5 mb-5">
      <div className="row text-center">
        <h1 className="mt-5">Ready to practice your first trade?</h1>
        <p>
          Create an Aiota virtual account with ₹1,00,000 simulated cash. Learn the complete trading flow without risking real money.
        </p>
        <a className="p-2 btn aiota-primary fs-5 mb-5" href={dashboardUrl}>Create virtual account</a>
      </div>
    </div>
  );
}

export default OpenAccount;
