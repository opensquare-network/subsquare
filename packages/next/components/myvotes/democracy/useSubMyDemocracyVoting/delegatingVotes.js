import normalizePrior from "../../utils/normalizePrior";

export default function getDelegatingVotesInfo(voting) {
  const delegating = voting.asDelegating;
  return {
    isDelegating: true,
    balance: delegating.balance.toString(),
    target: delegating.target.toString(),
    conviction: delegating.conviction.toNumber(),
    prior: normalizePrior(delegating.prior),
  };
}
