import Chains from "next-common/utils/consts/chains";

export function normalizeVote(vote, chain) {
  const isKintsugi = [Chains.kintsugi, Chains.interlay].includes(chain);
  if (isKintsugi) {
    return {
      ...vote,
      conviction: 1,
    };
  }

  return vote;
}
