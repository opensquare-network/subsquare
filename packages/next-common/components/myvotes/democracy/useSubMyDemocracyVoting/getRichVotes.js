import normalizeDemocracyVote from "../normalize";
import getReferendaInfo from "./referendaInfo";
import getReferendaPosts from "./posts";
import { omit } from "lodash-es";

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

  const posts = await getReferendaPosts(votes.map((v) => v.referendumIndex));
  return votes
    .map((vote) => {
      const referendumInfo = infoArr.find(
        (info) => info.referendumIndex === vote.referendumIndex,
      );
      const post = posts.find(
        (p) => p.referendumIndex === vote.referendumIndex,
      );

      return {
        ...vote,
        ...referendumInfo,
        post: omit(post, ["_id", "content"]),
      };
    })
    .sort((v1, v2) => v2.referendumIndex - v1.referendumIndex);
}
