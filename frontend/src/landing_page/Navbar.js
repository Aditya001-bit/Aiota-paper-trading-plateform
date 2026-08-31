import React from "react";
import { Link } from "react-router-dom";
import { dashboardUrl } from "../config";

export default function Navbar() {
  return <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom py-3"><div className="container"><Link className="navbar-brand fw-bold fs-3" to="/">A<span className="text-primary">I</span>OTA</Link><button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon" /></button><div className="collapse navbar-collapse justify-content-end" id="mainNav"><ul className="navbar-nav align-items-lg-center gap-lg-2"><li className="nav-item"><Link className="nav-link" to="/product">Simulator</Link></li><li className="nav-item"><Link className="nav-link" to="/about">About</Link></li><li className="nav-item"><Link className="nav-link" to="/support">Support</Link></li><li className="nav-item"><a className="btn aiota-primary ms-lg-3" href={dashboardUrl}>Launch Aiota</a></li></ul></div></div></nav>;
}
