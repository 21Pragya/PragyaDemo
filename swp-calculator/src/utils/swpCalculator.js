// src/utils/swpCalculator.js
// simulateEscalatingWithdrawal:
// - corpus: number (initial corpus, e.g. 10000000)
// - firstWithdrawal: number (year 1 withdrawal, e.g. 50000)
// - escalationPct: number (annual increase in withdrawal, e.g. 7 for 7%)
// - annualReturnPct: number (annual portfolio return, e.g. 8 for 8%)
// - years: integer (number of years to simulate)
//
// Returns an object with rows (per year), totalWithdrawn, finalBalance

export function simulateEscalatingWithdrawal({
  corpus,
  firstWithdrawal,
  escalationPct = 0,
  annualReturnPct = 0,
  years = 20,
}) {
  // basic validation & ensure numeric values
  corpus = Number(corpus) || 0;
  firstWithdrawal = Number(firstWithdrawal) || 0;
  escalationPct = Number(escalationPct) || 0;
  annualReturnPct = Number(annualReturnPct) || 0;
  years = Math.max(0, Math.floor(Number(years) || 0));

  let balance = corpus;
  const rows = [];
  let totalWithdrawn = 0;
  let lastWithdrawal = firstWithdrawal;

  for (let year = 1; year <= years; year++) {
    // 1) Growth for the year (annual compounding)
    const growth = balance * (annualReturnPct / 100);
    balance = balance + growth;

    // 2) Determine this year's withdrawal (escalate except for year 1)
    const withdrawal = year === 1
      ? firstWithdrawal
      : lastWithdrawal * (1 + escalationPct / 100);

    // 3) Cap withdrawal at current balance (can't withdraw more than available)
    const actualWithdrawal = withdrawal > balance ? balance : withdrawal;

    // 4) Deduct withdrawal
    balance = balance - actualWithdrawal;

    // 5) Record row
    rows.push({
      year,
      balanceStart: +( (balance + actualWithdrawal - growth).toFixed(2) ), // balance at start of year
      growth: +growth.toFixed(2),
      withdrawalPlanned: +withdrawal.toFixed(2),
      withdrawalActual: +actualWithdrawal.toFixed(2),
      balanceEnd: +balance.toFixed(2),
    });

    totalWithdrawn += actualWithdrawal;
    lastWithdrawal = withdrawal;

    if (balance <= 0.000001) break;
  }

  return {
    initialCorpus: +corpus.toFixed(2),
    totalWithdrawn: +totalWithdrawn.toFixed(2),
    finalBalance: +balance.toFixed(2),
    yearsSimulated: rows.length,
    rows,
  };
}
