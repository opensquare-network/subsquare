import chainDvDelegates from "next-common/utils/dv/delegates";
import { isNil, isNumber } from "lodash-es";
import { isBeforeAhm } from "next-common/hooks/useCompatibleMigrationHeight";

const getFinalBlockHeight = (ahmHeightsOrBlockHeight = null, indexer) => {
  if (isNil(ahmHeightsOrBlockHeight) || isNumber(ahmHeightsOrBlockHeight) || isNil(indexer)) {
    return ahmHeightsOrBlockHeight;
  }

  if (isBeforeAhm(indexer)) {
    return ahmHeightsOrBlockHeight.relay;
  }

  return ahmHeightsOrBlockHeight.assetHub;
};

function isSlotMatched(slot, trackId, voteFinishedIndexer) {
  const { blockHeight: voteFinishedHeight } = voteFinishedIndexer ?? {};
  const { start: ahmStart, end: ahmEnd, trackIds = [] } = slot;

  const start = getFinalBlockHeight(ahmStart, voteFinishedIndexer);
  const end = getFinalBlockHeight(ahmEnd, voteFinishedIndexer);

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

function getMatchedSlot(slots = [], trackId, voteFinishedIndexer) {
  return slots.find((slot) => isSlotMatched(slot, trackId, voteFinishedIndexer));
}

export function getDvCandidates(chain, trackId, voteFinishedIndexer) {
  if (!Object.keys(chainDvDelegates).includes(chain)) {
    return [];
  }

  const candidates = chainDvDelegates[chain];
  return candidates.reduce((acc, candidate) => {
    const matchedSlot = getMatchedSlot(
      candidate.slots || [],
      trackId,
      voteFinishedIndexer,
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

export default function getDvAddresses(chain, trackId, voteFinishedIndexer) {
  if (!Object.keys(chainDvDelegates).includes(chain)) {
    return [];
  }

  const candidates = chainDvDelegates[chain];
  return candidates
    .filter(
      (candidate) =>
        !!getMatchedSlot(candidate.slots || [], trackId, voteFinishedIndexer),
    )
    .map((candidate) => candidate.address);
}
