import chainDvDelegates from "next-common/utils/dv/delegates";
import { isNil } from "lodash-es";

export default function findDvAddresses(chain, trackId, voteFinishedHeight) {
  if (!Object.keys(chainDvDelegates).includes(chain)) {
    return [];
  }

  const candidates = chainDvDelegates[chain];
  return candidates
    .filter((candidate) => {
      const { slots = [] } = candidate;
      return slots.some(({ start, end, trackIds = [] }) => {
        if (!trackIds.includes(trackId)) {
          return false;
        }

        if (isNil(voteFinishedHeight) && !isNil(start) && !isNil(end)) {
          return false;
        }

        return !(voteFinishedHeight < start || voteFinishedHeight > end);
      });
    })
    .map((candidate) => candidate.address);
}
