import normalizePrior from "../../utils/normalizePrior";
import getDemocracyRichVotes from "./getRichVotes";

export default async function getDelegatingVotesInfo(voting, api) {
  const delegating = voting.asDelegating;
  const target = delegating.target.toString();
  const delegationCommon = {
    isDelegating: true,
    balance: delegating.balance.toString(),
    target,
    conviction: delegating.conviction.toNumber(),
    prior: normalizePrior(delegating.prior),
  };

  const targetVoting = await api.query.democracy.votingOf(target);
  if (targetVoting.isDelegating) {
    return delegationCommon;
  }

  const richVotes = await getDemocracyRichVotes(api, targetVoting);
  return {
    ...delegationCommon,
    delegatedVotes: richVotes,
  };
}
