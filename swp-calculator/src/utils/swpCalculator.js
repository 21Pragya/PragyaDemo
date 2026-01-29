export function simulateEscalatingWithdrawal({
  corpus,
  firstWithdrawal,
  escalationPct = 0,
  annualReturnPct = 0,
  years = 20,
}) {
  corpus = Number(corpus) || 0;
  firstWithdrawal = Number(firstWithdrawal) || 0;
  escalationPct = Number(escalationPct) || 0;
  annualReturnPct = Number(annualReturnPct) || 0;
  years = Math.max(0, Math.floor(Number(years) || 0));

  let balance = corpus;
  let lastWithdrawal = firstWithdrawal;
  let totalWithdrawn = 0;
  const rows = [];

  for (let year = 1; year <= years; year++) {
    const balanceStart = balance;

    // 1) Growth
    const growth = balanceStart * (annualReturnPct / 100);
    balance += growth;

    // 2) Withdrawal (escalating)
    const withdrawal =
      year === 1
        ? firstWithdrawal
        : lastWithdrawal * (1 + escalationPct / 100);

    // 3) Cap withdrawal
    const actualWithdrawal = Math.min(withdrawal, balance);

    // 4) Deduct
    balance -= actualWithdrawal;

    // 5) Store row
    rows.push({
      year,
      balanceStart: +balanceStart.toFixed(2),
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
