import normalizeDemocracyVote from "../normalize";
import getReferendaInfo from "./referendaInfo";

export default async function getDemocracyRichVotes(api, voting) {
  if (!voting.isDirect) {
    throw new Error(
      "getDemocracyRichVotes should only be called with direct voting",
    );
  }

  const direct = voting.asDirect;
  const votes = [];
  for (const vote of direct.votes) {
    const referendumIndex = vote[0].toNumber();
    votes.push({ referendumIndex, vote: normalizeDemocracyVote(vote[1]) });
  }

  const infoArr = await getReferendaInfo(
    api,
    votes.map((vote) => vote.referendumIndex),
  );
  return votes.map((vote) => {
    const referendumInfo = infoArr.find(
      (info) => info.referendumIndex === vote.referendumIndex,
    );

    return {
      ...vote,
      ...referendumInfo,
    };
  });
}
