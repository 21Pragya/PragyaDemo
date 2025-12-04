// src/pages/SwpCalculator.jsx
import React, { useState } from "react";
import { simulateEscalatingWithdrawal } from "../utils/swpCalculator";
import ResultsSummary from "../components/ResultsSummary";

function formatN(n) {
  if (n === null || n === undefined) return "-";
  return n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

export default function SwpCalculator() {
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

  React.useEffect(() => {
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h2>SWP — Escalating yearly withdrawals</h2>
      <p style={{ marginTop: 0, color: "#555" }}>
        Each year the corpus grows by the annual return, then the withdrawal (which escalates) is taken.
      </p>

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
          <ResultsSummary initial={result.initialCorpus} totalWithdrawn={result.totalWithdrawn} finalBalance={result.finalBalance} years={result.yearsSimulated} />
          
          <div style={{ marginTop: 12 }}>
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
          </div>
        </>
      )}
    </div>
  );
}
