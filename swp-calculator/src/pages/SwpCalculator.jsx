// src/pages/SwpCalculator.jsx
import React, { useState, useEffect } from "react";
import { simulateEscalatingWithdrawal } from "../utils/swpCalculator";
import { calculateLumpSum } from "../utils/valueCalculator";
import ResultsSummary from "../components/ResultsSummary";

function formatN(n) {
  if (n === null || n === undefined) return "-";
  return n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

const parseOrDefault = (str, fallback = 0) => {
  if (str === "" || str == null) return fallback;
  const n = Number(str);
  return Number.isFinite(n) ? n : fallback;
};

export default function SwpCalculator() {
  // ---------------- SWP STATES ----------------
  const [corpus, setCorpus] = useState("10000000");
  const [firstWithdrawal, setFirstWithdrawal] = useState("50000");
  const [escalationPct, setEscalationPct] = useState("7");
  const [annualReturnPct, setAnnualReturnPct] = useState("12");
  const [years, setYears] = useState("20");

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // ---------------- LUMP SUM STATES ----------------
  const [lsAmount, setLsAmount] = useState("10000000");
  const [lsYears, setLsYears] = useState("20");
  const [lsEscalation, setLsEscalation] = useState("7");
  const [lsResult, setLsResult] = useState(null);
  const [lsRows, setLsRows] = useState([]);

  // ---------------- SWP RUN ----------------
  const runSwp = (e) => {
    e?.preventDefault();
    setError("");

    const parsedYears = Math.max(0, Math.floor(parseOrDefault(years, 0)));
    if (parsedYears <= 0) {
      setError("Please enter a valid number of years (> 0).");
      setResult(null);
      return;
    }

    const res = simulateEscalatingWithdrawal({
      corpus: parseOrDefault(corpus),
      firstWithdrawal: parseOrDefault(firstWithdrawal),
      escalationPct: parseOrDefault(escalationPct),
      annualReturnPct: parseOrDefault(annualReturnPct),
      years: parsedYears,
    });

    setResult(res);
  };

  // ---------------- LUMP SUM RUN ----------------
  const runLumpSum = () => {
    const amount = Number(lsAmount);
    const yrs = Number(lsYears);
    const esc = Number(lsEscalation);

    const out = calculateLumpSum({
      investedAmount: amount,
      years: yrs,
      escalationPct: esc,
    });

    let value = amount;
    const rows = [];

    for (let y = 1; y <= yrs; y++) {
      value = value * (1 + esc / 100);
      rows.push({ year: y, value: +value.toFixed(2) });
    }

    setLsRows(rows);
    setLsResult(out);
  };

  useEffect(() => {
    runSwp();
  }, []);

  const ratio =
    result && lsResult && lsResult.futureValue > 0
      ? result.finalBalance / lsResult.futureValue
      : null;

  const ratioTimesLumpSum =
    ratio && lsAmount ? ratio * Number(lsAmount) : null;

  return (
    <div>
      <h2>SWP — Escalating yearly withdrawals</h2>

      {/* ---------------- COMBINED FORM ---------------- */}
      <form
        onSubmit={runSwp}
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
          marginBottom: 16,
        }}
      >
        <label>
          Corpus (₹)
          <input value={corpus} onChange={(e) => setCorpus(e.target.value)} />
        </label>

        <label>
          First year withdrawal (₹)
          <input
            value={firstWithdrawal}
            onChange={(e) => setFirstWithdrawal(e.target.value)}
          />
        </label>

        <label>
          Escalation % p.a.
          <input
            value={escalationPct}
            onChange={(e) => setEscalationPct(e.target.value)}
          />
        </label>

        <label>
          Annual return %
          <input
            value={annualReturnPct}
            onChange={(e) => setAnnualReturnPct(e.target.value)}
          />
        </label>

        <label>
          Years
          <input value={years} onChange={(e) => setYears(e.target.value)} />
        </label>

        {/* -------- LUMP SUM INPUTS -------- */}
        <label>
          Lump Sum Corpus (₹)
          <input value={lsAmount} onChange={(e) => setLsAmount(e.target.value)} />
        </label>

        <label>
          Lump Sum Years
          <input value={lsYears} onChange={(e) => setLsYears(e.target.value)} />
        </label>

        <label>
          Lump Sum Return % p.a.
          <input
            value={lsEscalation}
            onChange={(e) => setLsEscalation(e.target.value)}
          />
        </label>

        <div style={{ display: "flex", gap: 8, alignSelf: "end" }}>
          <button type="submit">Run SWP</button>
          <button type="button" onClick={runLumpSum}>
            Run Lump Sum
          </button>
        </div>
      </form>

      {error && <div style={{ color: "salmon" }}>{error}</div>}

      {/* ---------------- RESULTS ---------------- */}
      {result && (
        <>
          <ResultsSummary
            initial={result.initialCorpus}
            totalWithdrawn={result.totalWithdrawn}
            finalBalance={result.finalBalance}
            years={result.yearsSimulated}
          />

          {lsResult && (
            <div style={{ marginTop: 6 }}>
              <strong>Lump Sum Final Value:</strong>{" "}
              {formatN(lsResult.futureValue)}
            </div>
          )}

          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}>
            <thead>
              <tr>
                <th>Year</th>
                <th style={{ textAlign: "right" }}>Start Balance</th>
                <th style={{ textAlign: "right" }}>Growth</th>
                <th style={{ textAlign: "right" }}>Planned Withdrawal</th>
                <th style={{ textAlign: "right" }}>Actual Withdrawal</th>
                <th style={{ textAlign: "right" }}>End Balance</th>
                <th style={{ textAlign: "right" }}>Lump Sum Value</th>
              </tr>
            </thead>
            <tbody>
              {result.rows.map((r) => (
                <tr key={r.year}>
                  <td>{r.year}</td>
                  <td style={{ textAlign: "right" }}>{formatN(r.balanceStart)}</td>
                  <td style={{ textAlign: "right" }}>{formatN(r.growth)}</td>
                  <td style={{ textAlign: "right" }}>{formatN(r.withdrawalPlanned)}</td>
                  <td style={{ textAlign: "right" }}>{formatN(r.withdrawalActual)}</td>
                  <td style={{ textAlign: "right" }}>{formatN(r.balanceEnd)}</td>
                  <td style={{ textAlign: "right" }}>
                    {lsRows[r.year - 1]
                      ? formatN(lsRows[r.year - 1].value)
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* ---------------- RATIO OUTPUT ---------------- */}
      {ratio && (
        <div style={{ marginTop: 24 }}>
          <strong>Ratio (SWP ÷ Lump Sum):</strong> {ratio.toFixed(2)}
        </div>
      )}

      {ratioTimesLumpSum && (
        <div style={{ marginTop: 8 }}>
          <strong>Ratio × Lump Sum Corpus:</strong>{" "}
          {formatN(ratioTimesLumpSum)}
        </div>
      )}
    </div>
  );
}
