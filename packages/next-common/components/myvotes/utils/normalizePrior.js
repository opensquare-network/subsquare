export default function normalizePrior(prior) {
  return {
    unlockAt: prior[0].toNumber(),
    balance: prior[1].toString(),
  };
}
