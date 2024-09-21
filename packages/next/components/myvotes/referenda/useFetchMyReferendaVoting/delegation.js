import normalizePrior from "../../utils/normalizePrior";
import queryReferendumInfo from "../queryReferendumInfo";
import { getOpenGovReferendaPosts } from "next-common/utils/posts";

export default async function getDelegatedVoting(api, trackId, voting) {
  const delegating = voting.asDelegating;
  const balance = delegating.balance.toString();
  const conviction = delegating.conviction.toNumber();
  const prior = normalizePrior(delegating.prior);

  const target = delegating.target.toString();
  const targetVoting = await api.query.convictionVoting.votingFor(
    target,
    trackId,
  );
  if (!targetVoting.isCasting) {
    return {
      isDelegating: true,
      balance,
      conviction,
      votes: [],
      prior,
    };
  }

  const casting = targetVoting.asCasting;
  const votes = casting.votes.reduce((result, voteInfo) => {
    const referendumIndex = voteInfo[0].toNumber();
    const accountVote = voteInfo[1];
    if (accountVote.isStandard) {
      return [
        ...result,
        {
          trackId,
          referendumIndex,
          vote: {
            isDelegating: true,
            isStandard: true,
            balance,
            conviction,
            aye: accountVote.asStandard.vote.isAye,
          },
        },
      ];
    }
    return result;
  }, []);

  const promises = [];
  for (const vote of votes) {
    promises.push(queryReferendumInfo(api, vote.referendumIndex));
  }
  const infoArr = await Promise.all(promises);

  const indexes = votes.map((v) => v.referendumIndex);
  const posts = await getOpenGovReferendaPosts(indexes);

  const normalizedVotes = votes.map((vote) => {
    const referendumInfo = infoArr.find(
      (info) => info.referendumIndex === vote.referendumIndex,
    );
    const post = posts.find((p) => p.referendumIndex === vote.referendumIndex);
    return {
      ...vote,
      ...(referendumInfo || {}),
      post,
    };
  });

  return {
    isDelegating: true,
    balance,
    conviction,
    trackId,
    delegatedVotes: normalizedVotes,
    votes: [],
    prior,
  };
}
