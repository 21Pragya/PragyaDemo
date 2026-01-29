// src/pages/Home.jsx
import React from "react";

export default function Home({ onNavigate = () => {} }) {
  return (
    <div>
      <h1>Welcome — Finance Tools</h1>
      <p>Pick a calculator to begin. Each tool is lightweight and runs entirely in your browser.</p>

      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        <div style={{ padding: 12, border: "1px solid #ddd", width: 300 }}>
          <h3>SWP (Withdrawal)</h3>
          <p>Simulate escalating yearly withdrawals from a lump sum corpus.</p>
          <button onClick={() => onNavigate("swp")}>Open SWP</button>
        </div>

        <div style={{ padding: 12, border: "1px solid #ddd", width: 300 }}>
          <h3>SIP (Investment)</h3>
          <p>Simulate monthly SIP contributions and growth over time.</p>
          <button onClick={() => onNavigate("sip")}>Open SIP</button>
        </div>

            <div style={{ padding: 12, border: "1px solid #ddd", width: 300 }}>
  <h3>Lump Sum Calculator</h3>
  <p>Calculate future value of a one-time investment.</p>
  <button onClick={() => onNavigate("value")}>Open</button>
</div>

      </div>
      
  
    </div>
  );
}
