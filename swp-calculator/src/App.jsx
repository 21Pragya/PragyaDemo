// src/App.jsx
import React, { useState } from "react";
import { simulateEscalatingWithdrawal } from "./utils/swpCalculator";

function formatN(n) {
  if (n === null || n === undefined) return "-";
  return n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

export default function App() {
  const [corpus, setCorpus] = useState(10000000); 
  const [firstWithdrawal, setFirstWithdrawal] = useState(50000);
  const [escalationPct, setEscalationPct] = useState(7);
  const [annualReturnPct, setAnnualReturnPct] = useState(8);
  const [years, setYears] = useState(20);

  const [result, setResult] = useState(null);

  const run = (e) => {
    e?.preventDefault();
    const res = simulateEscalatingWithdrawal({
      corpus,
      firstWithdrawal,
      escalationPct,
      annualReturnPct,
      years,
    });
    setResult(res);
  };

  // run initial simulation once (optional)
  React.useEffect(() => {
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ maxWidth: 1000, margin: "28px auto", fontFamily: "Inter, Arial" }}>
      <h1>SWP-like Escalating Withdrawal Simulator</h1>
      <p>Each year, balance grows by the annual return, then withdrawal (which escalates) is taken.</p>

      <form onSubmit={run} style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", marginBottom: 16 }}>
        <label>
          Corpus (₹)
          <input type="number" value={corpus} onChange={(e) => setCorpus(Number(e.target.value))} />
        </label>

        <label>
          First year withdrawal (₹)
          <input type="number" value={firstWithdrawal} onChange={(e) => setFirstWithdrawal(Number(e.target.value))} />
        </label>

        <label>
          Escalation % p.a.
          <input type="number" value={escalationPct} onChange={(e) => setEscalationPct(Number(e.target.value))} />
        </label>

        <label>
          Annual return % (portfolio)
          <input type="number" value={annualReturnPct} onChange={(e) => setAnnualReturnPct(Number(e.target.value))} />
        </label>

        <label>
          Years to simulate
          <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} />
        </label>

        <div style={{ alignSelf: "end" }}>
          <button type="submit" style={{ padding: "8px 14px" }}>Run</button>
        </div>
      </form>

      {result && (
        <>
          <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
            <div style={{ padding: 12, border: "1px solid #ddd" }}>
              <div>Initial corpus</div>
              <div style={{ fontWeight: 700 }}>₹ {formatN(result.initialCorpus)}</div>
            </div>
            <div style={{ padding: 12, border: "1px solid #ddd" }}>
              <div>Total withdrawn</div>
              <div style={{ fontWeight: 700 }}>₹ {formatN(result.totalWithdrawn)}</div>
            </div>
            <div style={{ padding: 12, border: "1px solid #ddd" }}>
              <div>Final balance after {result.yearsSimulated} years</div>
              <div style={{ fontWeight: 700 }}>₹ {formatN(result.finalBalance)}</div>
            </div>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ borderBottom: "1px solid #ddd", textAlign: "left" }}>Year</th>
                <th style={{ borderBottom: "1px solid #ddd", textAlign: "right" }}>Start Balance (₹)</th>
                <th style={{ borderBottom: "1px solid #ddd", textAlign: "right" }}>Growth (₹)</th>
                <th style={{ borderBottom: "1px solid #ddd", textAlign: "right" }}>Planned Withdrawal (₹)</th>
                <th style={{ borderBottom: "1px solid #ddd", textAlign: "right" }}>Actual Withdrawal (₹)</th>
                <th style={{ borderBottom: "1px solid #ddd", textAlign: "right" }}>End Balance (₹)</th>
              </tr>
            </thead>
            <tbody>
              {result.rows.map((r) => (
                <tr key={r.year}>
                  <td style={{ padding: "6px 0" }}>{r.year}</td>
                  <td style={{ padding: "6px 8px", textAlign: "right" }}>{formatN(r.balanceStart)}</td>
                  <td style={{ padding: "6px 8px", textAlign: "right" }}>{formatN(r.growth)}</td>
                  <td style={{ padding: "6px 8px", textAlign: "right" }}>{formatN(r.withdrawalPlanned)}</td>
                  <td style={{ padding: "6px 8px", textAlign: "right" }}>{formatN(r.withdrawalActual)}</td>
                  <td style={{ padding: "6px 8px", textAlign: "right" }}>{formatN(r.balanceEnd)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
