// src/pages/SipCalculator.jsx
import React, { useState } from "react";
import { simulateSIP } from "../utils/sipCalculator";
import ResultsSummary from "../components/ResultsSummary";

function formatN(n) {
  return n?.toLocaleString("en-IN", { maximumFractionDigits: 2 }) ?? "-";
}

export default function SipCalculator() {
  const [monthlySip, setMonthlySip] = useState(10000);
  const [annualReturnPct, setAnnualReturnPct] = useState(12);
  const [years, setYears] = useState(10);
  const [escalationPct, setEscalationPct] = useState(10); // NEW FIELD
  const [res, setRes] = useState(null);

  const run = (e) => {
    e?.preventDefault();
    const out = simulateSIP({
      monthlySip,
      annualReturnPct,
      years,
      escalationPct, // pass into function
    });
    setRes(out);
  };

  React.useEffect(() => { run(); }, []);

  return (
    <div>
      <h2>SIP — Monthly contribution growth</h2>

      <form
        onSubmit={run}
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
          marginBottom: 12,
        }}
      >
        <label>
          Monthly SIP (₹)
          <input
            type="number"
            value={monthlySip}
            onChange={(e) => setMonthlySip(Number(e.target.value))}
          />
        </label>

        <label>
          Annual return %
          <input
            type="number"
            value={annualReturnPct}
            onChange={(e) => setAnnualReturnPct(Number(e.target.value))}
          />
        </label>

        <label>
          Years
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
          />
        </label>

        {/* ⭐ NEW INPUT — Escalation % per year */}
        <label>
          SIP Escalation % p.a.
          <input
            type="number"
            value={escalationPct}
            onChange={(e) => setEscalationPct(Number(e.target.value))}
          />
        </label>

        <div style={{ alignSelf: "end" }}>
          <button type="submit" style={{ padding: "8px 14px" }}>Run</button>
        </div>
      </form>

      {res && (
        <>
          <ResultsSummary
            initial={0}
            totalWithdrawn={res.totalInvested}
            finalBalance={res.maturityValue}
            years={years}
            labelTotal="Total invested"
          />

          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>Year</th>
                <th style={{ textAlign: "right", borderBottom: "1px solid #ddd" }}>Monthly SIP at Start (₹)</th>
                <th style={{ textAlign: "right", borderBottom: "1px solid #ddd" }}>Yearly Invested (₹)</th>
                <th style={{ textAlign: "right", borderBottom: "1px solid #ddd" }}>Value End of Year (₹)</th>
              </tr>
            </thead>
            <tbody>
              {res.yearly.map((y) => (
                <tr key={y.year}>
                  <td style={{ padding: 6 }}>{y.year}</td>

                  {/* NEW: show SIP amount for that year */}
                  <td style={{ padding: 6, textAlign: "right" }}>
                    {formatN(y.monthlySipStartOfYear)}
                  </td>

                  <td style={{ padding: 6, textAlign: "right" }}>
                    {formatN(y.invested)}
                  </td>

                  <td style={{ padding: 6, textAlign: "right" }}>
                    {formatN(y.endValue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
