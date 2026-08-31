import React, { useContext } from "react"; import { AiotaContext } from "./AiotaContext";
export default function Toast() { const { toast } = useContext(AiotaContext); return toast ? <div className={`toast-message ${toast.type}`}>{toast.message}</div> : null; }
