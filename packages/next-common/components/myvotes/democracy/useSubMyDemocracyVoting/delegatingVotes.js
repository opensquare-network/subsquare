import normalizePrior from "../../utils/normalizePrior";
import getDemocracyRichVotes from "./getRichVotes";
import getReferendaPosts from "./posts";
import { omit } from "lodash-es";

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
  const posts = await getReferendaPosts(
    richVotes.map((v) => v.referendumIndex),
  );
  const delegatedVotes = richVotes.map((vote) => {
    const post = posts.find((p) => p.referendumIndex === vote.referendumIndex);
    return {
      ...vote,
      post: omit(post, ["_id", "content"]),
    };
  });
  return {
    ...delegationCommon,
    delegatedVotes,
  };
}
