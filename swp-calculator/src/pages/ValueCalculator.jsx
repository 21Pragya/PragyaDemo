import React, { useState, useEffect } from "react";
import { calculateLumpSum } from "../utils/valueCalculator";
import ResultsSummary from "../components/ResultsSummary";

const formatN = (n) =>
  n?.toLocaleString("en-IN", { maximumFractionDigits: 2 }) ?? "-";

export default function LumpSumCalculator() {
  const [amount, setAmount] = useState("10000");
  const [years, setYears] = useState("20");
  const [escalationPct, setEscalationPct] = useState("7");

  const [res, setRes] = useState(null);

  const run = (e) => {
    e?.preventDefault();

    const out = calculateLumpSum({
      investedAmount: Number(amount),
      years: Number(years),
      escalationPct: Number(escalationPct),
    });

    setRes(out);
  };

  useEffect(() => {
    run();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <h2>Lump Sum Growth Calculator</h2>

      <form
        onSubmit={run}
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
        }}
      >
        <label>
          Invested Amount (₹)
          <input value={amount} onChange={(e) => setAmount(e.target.value)} />
        </label>

        <label>
          Years
          <input value={years} onChange={(e) => setYears(e.target.value)} />
        </label>

        <label>
          Escalation % p.a.
          <input value={escalationPct} onChange={(e) => setEscalationPct(e.target.value)} />
        </label>

        <div style={{ alignSelf: "end" }}>
          <button type="submit">Run</button>
        </div>
      </form>

      {res && (
        <ResultsSummary
          initial={res.investedAmount}
          totalWithdrawn={0}
          finalBalance={res.futureValue}
          years={res.years}
          labelTotal="Invested Amount"
        />
      )}
    </div>
  );
}
