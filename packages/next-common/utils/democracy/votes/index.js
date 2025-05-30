import { getReferendumVotesByHeight } from "./passed";

export default async function getReferendumVotes(api, referendumIndex) {
  return await getReferendumVotesByHeight(api, referendumIndex);
}
