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
  const runLumpSum = (e) => {
    e?.preventDefault();

    const amount = Number(lsAmount);
    const yrs = Number(lsYears);
    const esc = Number(lsEscalation);

    const out = calculateLumpSum({
      investedAmount: amount,
      years: yrs,
      escalationPct: esc,
    });

    // build year-wise rows
    let value = amount;
    const rows = [];

    for (let y = 1; y <= yrs; y++) {
      value = value * (1 + esc / 100);
      rows.push({
        year: y,
        value: +value.toFixed(2),
      });
    }

    setLsRows(rows);
    setLsResult(out);
  };

  useEffect(() => {
    runSwp();
    // eslint-disable-next-line
  }, []);

  const ratio =
    result && lsResult && lsResult.futureValue > 0
      ? result.finalBalance / lsResult.futureValue
      : null;

    
  const ratioTimesLumpSum =
  ratio && lsAmount
    ? ratio * Number(lsAmount)
    : null;

  return (
    <div>
      <h2>SWP — Escalating yearly withdrawals</h2>

      {/* ---------------- SWP FORM ---------------- */}
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
          <input value={firstWithdrawal} onChange={(e) => setFirstWithdrawal(e.target.value)} />
        </label>

        <label>
          Escalation % p.a.
          <input value={escalationPct} onChange={(e) => setEscalationPct(e.target.value)} />
        </label>

        <label>
          Annual return %
          <input value={annualReturnPct} onChange={(e) => setAnnualReturnPct(e.target.value)} />
        </label>

        <label>
          Years
          <input value={years} onChange={(e) => setYears(e.target.value)} />
        </label>

        <div style={{ alignSelf: "end" }}>
          <button type="submit">Run SWP</button>
        </div>
      </form>

      {error && <div style={{ color: "salmon" }}>{error}</div>}

      {result && (
        <>
          <ResultsSummary
            initial={result.initialCorpus}
            totalWithdrawn={result.totalWithdrawn}
            finalBalance={result.finalBalance}
            years={result.yearsSimulated}
          />

          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}>
            <thead>
              <tr>
                <th>Year</th>
                <th style={{ textAlign: "right" }}>Start Balance</th>
                <th style={{ textAlign: "right" }}>Growth</th>
                <th style={{ textAlign: "right" }}>Planned Withdrawal</th>
                <th style={{ textAlign: "right" }}>Actual Withdrawal</th>
                <th style={{ textAlign: "right" }}>End Balance</th>
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
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* ---------------- LUMP SUM SECTION ---------------- */}
      <hr style={{ margin: "32px 0" }} />
      <h2>Lump Sum Future Value</h2>

      <form
        onSubmit={runLumpSum}
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
        }}
      >
        <label>
          Corpus (₹)
          <input value={lsAmount} onChange={(e) => setLsAmount(e.target.value)} />
        </label>

        <label>
          Years
          <input value={lsYears} onChange={(e) => setLsYears(e.target.value)} />
        </label>

        <label>
          Escalation % p.a.
          <input value={lsEscalation} onChange={(e) => setLsEscalation(e.target.value)} />
        </label>

        <div style={{ alignSelf: "end" }}>
          <button type="submit">Calculate</button>
        </div>
      </form>

      {lsResult && (
        <>
          <ResultsSummary
            initial={lsResult.investedAmount}
            totalWithdrawn={0}
            finalBalance={lsResult.futureValue}
            years={lsResult.years}
            labelTotal="Invested Amount"
          />

          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}>
            <thead>
              <tr>
                <th>Year</th>
                <th style={{ textAlign: "right" }}>Value (₹)</th>
              </tr>
            </thead>
            <tbody>
              {lsRows.map((r) => (
                <tr key={r.year}>
                  <td>{r.year}</td>
                  <td style={{ textAlign: "right" }}>{formatN(r.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* ---------------- RATIO ---------------- */}
      {ratio && (
        <>
          <hr style={{ margin: "32px 0" }} />
          <h3>Ratio</h3>
          <p>
            <strong>SWP Final Balance ÷ Lump Sum Final Balance =</strong>{" "}
            {ratio.toFixed(2)}
          </p>
        </>
      )}

      {ratioTimesLumpSum && (
  <div style={{ marginTop: 12 }}>
    <strong>Ratio × Lump Sum Corpus:</strong>
    <div>{formatN(ratioTimesLumpSum)}</div>
  </div>
)}

    </div>

    
  );
}
