export function calculateLumpSum({
  investedAmount,
  years,
  escalationPct = 7,
}) {
  const rate = escalationPct / 100;

  const futureValue = investedAmount * Math.pow(1 + rate, years);

  return {
    investedAmount,
    years,
    escalationPct,
    futureValue,
  };
}
