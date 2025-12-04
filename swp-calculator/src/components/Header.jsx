// src/components/Header.jsx
import React from "react";

export default function Header({ route, setRoute }) {
  return (
    <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
      <div>
        <h2 style={{ margin: 0 }}>PragyaDemo — Finance Tools</h2>
        <div style={{ fontSize: 12, color: "#666" }}>Simple calculators (SWP, SIP, ...)</div>
      </div>

      <nav>
        <button onClick={() => setRoute("home")} style={{ marginRight: 8, padding: "6px 10px", background: route === "home" ? "#eef" : "transparent" }}>Home</button>
        <button onClick={() => setRoute("swp")} style={{ marginRight: 8, padding: "6px 10px", background: route === "swp" ? "#eef" : "transparent" }}>SWP</button>
        <button onClick={() => setRoute("sip")} style={{ padding: "6px 10px", background: route === "sip" ? "#eef" : "transparent" }}>SIP</button>
      </nav>
    </header>
  );
}
