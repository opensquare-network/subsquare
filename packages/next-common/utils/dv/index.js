import chainDvDelegates from "next-common/utils/dv/delegates";
import { isNil } from "lodash-es";

function isSlotMatched(slot, trackId, voteFinishedHeight) {
  const { start, end, trackIds = [] } = slot;

  if (!isNil(trackId) && !trackIds.includes(trackId)) {
    return false;
  }

  if (!isNil(voteFinishedHeight)) {
    return (
      voteFinishedHeight >= start && (isNil(end) || end > voteFinishedHeight)
    );
  }

  if (isNil(end)) {
    return true;
  }

  return voteFinishedHeight >= start && voteFinishedHeight < end;
}

function getMatchedSlot(slots = [], trackId, voteFinishedHeight) {
  return slots.find((slot) => isSlotMatched(slot, trackId, voteFinishedHeight));
}

export function getDvCandidates(chain, trackId, voteFinishedHeight) {
  if (!Object.keys(chainDvDelegates).includes(chain)) {
    return [];
  }

  const candidates = chainDvDelegates[chain];
  return candidates.reduce((acc, candidate) => {
    const matchedSlot = getMatchedSlot(
      candidate.slots || [],
      trackId,
      voteFinishedHeight,
    );

    if (matchedSlot) {
      acc.push({
        address: candidate.address,
        role: matchedSlot.role || "",
      });
    }
    return acc;
  }, []);
}

export default function getDvAddresses(chain, trackId, voteFinishedHeight) {
  if (!Object.keys(chainDvDelegates).includes(chain)) {
    return [];
  }

  const candidates = chainDvDelegates[chain];
  return candidates
    .filter(
      (candidate) =>
        !!getMatchedSlot(candidate.slots || [], trackId, voteFinishedHeight),
    )
    .map((candidate) => candidate.address);
}
