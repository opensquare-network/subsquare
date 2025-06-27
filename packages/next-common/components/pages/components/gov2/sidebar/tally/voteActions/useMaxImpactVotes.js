import { getImpactVotes, absBigInt } from "./common";

export default function useMaxImpactVotes(voteActions) {
  let maxImpactVotes = BigInt(0);

  voteActions.forEach(({ data, type }) => {
    const impactVotes = getImpactVotes(data, type);
    if (impactVotes) {
      const absImpactVotes = absBigInt(impactVotes);
      if (absImpactVotes > maxImpactVotes) {
        maxImpactVotes = absImpactVotes;
      }
    }
  });

  return maxImpactVotes;
}
