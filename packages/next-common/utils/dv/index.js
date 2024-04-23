import chainDvDelegates from "next-common/utils/dv/delegates";
import { isNil } from "lodash-es";

export default function getDvAddresses(chain, trackId, voteFinishedHeight) {
  if (!Object.keys(chainDvDelegates).includes(chain)) {
    return [];
  }

  const candidates = chainDvDelegates[chain];
  return candidates
    .filter((candidate) => {
      const { slots = [] } = candidate;
      return slots.some(({ start, end, trackIds = [] }) => {
        if (!isNil(trackId) && !trackIds.includes(trackId)) {
          return false;
        }

        if (!isNil(voteFinishedHeight)) {
          // if referendum votes finished, then finished height should be between start and end
          return (
            voteFinishedHeight >= start &&
            (isNil(end) || end > voteFinishedHeight)
          );
        }

        if (isNil(end)) {
          // referendum ongoing and DV ongoing
          return true;
        }

        return voteFinishedHeight >= start && voteFinishedHeight < end;
      });
    })
    .map((candidate) => candidate.address);
}
