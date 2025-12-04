// src/components/ResultsSummary.jsx
import React from "react";

export default function ResultsSummary({ initial = 0, totalWithdrawn = 0, finalBalance = 0, years = 0, labelTotal = "Total withdrawn" }) {
  const fmt = (n) => {
    if (n === null || n === undefined) return "-";
    return n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
  };

  return (
    <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
      <div style={{ padding: 12, border: "1px solid #ddd" }}>
        <div style={{ fontSize: 12, color: "#666" }}>Initial corpus</div>
        <div style={{ fontWeight: 700 }}>₹ {fmt(initial)}</div>
      </div>

      <div style={{ padding: 12, border: "1px solid #ddd" }}>
        <div style={{ fontSize: 12, color: "#666" }}>{years} years / {labelTotal}</div>
        <div style={{ fontWeight: 700 }}>₹ {fmt(totalWithdrawn)}</div>
      </div>

      <div style={{ padding: 12, border: "1px solid #ddd" }}>
        <div style={{ fontSize: 12, color: "#666" }}>Final balance</div>
        <div style={{ fontWeight: 700 }}>₹ {fmt(finalBalance)}</div>
      </div>
    </div>
  );
}
