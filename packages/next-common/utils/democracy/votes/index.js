import { getReferendumVotesByHeight } from "./passed";
import { getOnChainReferendum } from "./onChain";

export default async function getReferendumVotes(api, referendumIndex, height) {
  if (height) {
    return await getReferendumVotesByHeight(api, height, referendumIndex);
  }

  return await getOnChainReferendum(api, referendumIndex);
}
