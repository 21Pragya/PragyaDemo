

export function simulateSIP({
  monthlySip = 0,
  annualReturnPct = 0,
  years = 10,
  escalationPct = 0, // new param
}) {
  monthlySip = Number(monthlySip) || 0;
  annualReturnPct = Number(annualReturnPct) || 0;
  years = Math.max(0, Math.floor(Number(years) || 0));
  escalationPct = Number(escalationPct) || 0;

  const monthlyReturn = Math.pow(1 + annualReturnPct / 100, 1 / 12) - 1;
  let balance = 0;
  const yearly = [];
  let totalInvested = 0;

  // current monthly SIP used for the current year
  let currentMonthlySip = monthlySip;

  for (let y = 1; y <= years; y++) {
    let investedThisYear = 0;

    // record the monthly SIP used at the start of this year
    const monthlySipThisYear = currentMonthlySip;

    for (let m = 1; m <= 12; m++) {
      balance = balance * (1 + monthlyReturn);
      balance += monthlySipThisYear;
      investedThisYear += monthlySipThisYear;
      totalInvested += monthlySipThisYear;
    }

    yearly.push({
      year: y,
      monthlySipStartOfYear: +monthlySipThisYear.toFixed(2),
      invested: +investedThisYear.toFixed(2),
      endValue: +balance.toFixed(2),
    });

    // escalate monthly SIP for next year
    currentMonthlySip = currentMonthlySip * (1 + escalationPct / 100);
  }

  return {
    monthlySip: +monthlySip.toFixed(2),
    annualReturnPct,
    years,
    escalationPct,
    totalInvested: +totalInvested.toFixed(2),
    maturityValue: +balance.toFixed(2),
    yearly,
  };
}
