import React from "react";

import Dashboard from "./Dashboard"; import TopBar from "./TopBar"; import AuthGate from "./AuthGate"; import { AiotaProvider } from "./AiotaContext"; import Toast from "./Toast";

const Home = () => {
  return (
    <AiotaProvider><AuthGate><TopBar /><Dashboard /><Toast /></AuthGate></AiotaProvider>
  );
};

export default Home;
