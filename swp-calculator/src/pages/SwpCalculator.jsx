// src/pages/SwpCalculator.jsx
import React, { useState } from "react";
import { simulateEscalatingWithdrawal } from "../utils/swpCalculator";
import ResultsSummary from "../components/ResultsSummary";

function formatN(n) {
  if (n === null || n === undefined) return "-";
  return n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

// safe parser that preserves empty input as "missing" and returns fallback for computation
const parseOrDefault = (str, fallback = 0) => {
  if (str === "" || str == null) return fallback;
  const n = Number(str);
  return Number.isFinite(n) ? n : fallback;
};

export default function SwpCalculator() {
  // keep inputs as strings so clearing shows empty field
  const [corpus, setCorpus] = useState("10000000");
  const [firstWithdrawal, setFirstWithdrawal] = useState("50000");
  const [escalationPct, setEscalationPct] = useState("7");
  const [annualReturnPct, setAnnualReturnPct] = useState("8");
  const [years, setYears] = useState("20");

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const run = (e) => {
    e?.preventDefault();
    setError("");

    // parse inputs for computation (input strings remain untouched)
    const parsedCorpus = parseOrDefault(corpus, 0);
    const parsedFirstWithdrawal = parseOrDefault(firstWithdrawal, 0);
    const parsedEscalation = parseOrDefault(escalationPct, 0);
    const parsedReturn = parseOrDefault(annualReturnPct, 0);
    const parsedYears = Math.max(0, Math.floor(parseOrDefault(years, 0)));

    // simple validation example: require years > 0
    if (parsedYears <= 0) {
      setError("Please enter a valid number of years (> 0).");
      setResult(null);
      return;
    }

    const res = simulateEscalatingWithdrawal({
      corpus: parsedCorpus,
      firstWithdrawal: parsedFirstWithdrawal,
      escalationPct: parsedEscalation,
      annualReturnPct: parsedReturn,
      years: parsedYears,
    });

    setResult(res);
  };

  // initial run with defaults
  React.useEffect(() => {
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h2>SWP — Escalating yearly withdrawals</h2>
      <p style={{ marginTop: 0, color: "#bbb" }}>
        Each year the corpus grows by the annual return, then the withdrawal (which escalates) is taken.
      </p>

      <form
        onSubmit={run}
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
          marginBottom: 16,
        }}
      >
        <label>
          Corpus (₹)
          <input
            type="text"
            placeholder="e.g. 10000000"
            value={corpus}
            onChange={(e) => setCorpus(e.target.value)}
          />
        </label>

        <label>
          First year withdrawal (₹)
          <input
            type="text"
            placeholder="e.g. 50000"
            value={firstWithdrawal}
            onChange={(e) => setFirstWithdrawal(e.target.value)}
          />
        </label>

        <label>
          Escalation % p.a.
          <input
            type="text"
            placeholder="e.g. 7"
            value={escalationPct}
            onChange={(e) => setEscalationPct(e.target.value)}
          />
        </label>

        <label>
          Annual return % (portfolio)
          <input
            type="text"
            placeholder="e.g. 8"
            value={annualReturnPct}
            onChange={(e) => setAnnualReturnPct(e.target.value)}
          />
        </label>

        <label>
          Years to simulate
          <input
            type="text"
            placeholder="e.g. 20"
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
        </label>

        <div style={{ alignSelf: "end" }}>
          <button type="submit" style={{ padding: "8px 14px" }}>
            Run
          </button>
        </div>
      </form>

      {error && <div style={{ color: "salmon", marginBottom: 12 }}>{error}</div>}

      {result && (
        <>
          <ResultsSummary
            initial={result.initialCorpus}
            totalWithdrawn={result.totalWithdrawn}
            finalBalance={result.finalBalance}
            years={result.yearsSimulated}
          />

          <div style={{ marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: "1px solid #444', textAlign: 'left" }}>Year</th>
                  <th style={{ borderBottom: "1px solid #444", textAlign: "right" }}>Start Balance (₹)</th>
                  <th style={{ borderBottom: "1px solid #444", textAlign: "right" }}>Growth (₹)</th>
                  <th style={{ borderBottom: "1px solid #444", textAlign: "right" }}>Planned Withdrawal (₹)</th>
                  <th style={{ borderBottom: "1px solid #444", textAlign: "right" }}>Actual Withdrawal (₹)</th>
                  <th style={{ borderBottom: "1px solid #444", textAlign: "right" }}>End Balance (₹)</th>
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
