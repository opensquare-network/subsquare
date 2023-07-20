import { isKintsugiChain } from "next-common/utils/chain";

export function normalizeVote(vote, chain) {
  const isKintsugi = isKintsugiChain(chain);
  if (isKintsugi) {
    return {
      ...vote,
      conviction: 1,
    };
  }

  return vote;
}
