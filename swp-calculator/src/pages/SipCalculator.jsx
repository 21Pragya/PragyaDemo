// src/pages/SipCalculator.jsx
import React, { useState } from "react";
import { simulateSIP } from "../utils/sipCalculator";
import ResultsSummary from "../components/ResultsSummary";

function formatN(n) {
  return n?.toLocaleString("en-IN", { maximumFractionDigits: 2 }) ?? "-";
}

// helper to parse numeric input strings safely
const parseOrDefault = (str, fallback = 0) => {
  if (str === "" || str == null) return fallback;
  const n = Number(str);
  return Number.isFinite(n) ? n : fallback;
};

export default function SipCalculator() {
  // store inputs as strings so they can be empty
  const [monthlySip, setMonthlySip] = useState("10000");
  const [annualReturnPct, setAnnualReturnPct] = useState("12");
  const [years, setYears] = useState("10");
  const [escalationPct, setEscalationPct] = useState("10");

  const [res, setRes] = useState(null);
  const [error, setError] = useState("");

  const run = (e) => {
    e?.preventDefault();
    setError("");

    // parse values here, don't overwrite the input strings
    const parsedMonthly = parseOrDefault(monthlySip, 0);
    const parsedReturn = parseOrDefault(annualReturnPct, 0);
    const parsedYears = Math.max(0, Math.floor(parseOrDefault(years, 0)));
    const parsedEsc = parseOrDefault(escalationPct, 0);

    // optional validation: require years > 0
    if (parsedYears <= 0) {
      setError("Please enter a valid number of years (> 0).");
      setRes(null);
      return;
    }

    const out = simulateSIP({
      monthlySip: parsedMonthly,
      annualReturnPct: parsedReturn,
      years: parsedYears,
      escalationPct: parsedEsc,
    });

    setRes(out);
  };

  // initial run using default string values
  React.useEffect(() => { run(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

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
            type="text"
            placeholder="e.g. 10000"
            value={monthlySip}
            onChange={(e) => setMonthlySip(e.target.value)}
          />
        </label>

        <label>
          Annual return %
          <input
            type="text"
            placeholder="e.g. 12"
            value={annualReturnPct}
            onChange={(e) => setAnnualReturnPct(e.target.value)}
          />
        </label>

        <label>
          Years
          <input
            type="text"
            placeholder="e.g. 10"
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
        </label>

        <label>
          SIP Escalation % p.a.
          <input
            type="text"
            placeholder="e.g. 10"
            value={escalationPct}
            onChange={(e) => setEscalationPct(e.target.value)}
          />
        </label>

        <div style={{ alignSelf: "end" }}>
          <button type="submit" style={{ padding: "8px 14px" }}>
            Run
          </button>
        </div>
      </form>

      {error && <div style={{ color: "salmon", marginBottom: 12 }}>{error}</div>}

      {res && (
        <>
          <ResultsSummary
            initial={0}
            totalWithdrawn={res.totalInvested}
            finalBalance={res.maturityValue}
            years={res.years}
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
                  <td style={{ padding: 6, textAlign: "right" }}>{formatN(y.monthlySipStartOfYear)}</td>
                  <td style={{ padding: 6, textAlign: "right" }}>{formatN(y.invested)}</td>
                  <td style={{ padding: 6, textAlign: "right" }}>{formatN(y.endValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
