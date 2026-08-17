import chainDvDelegates from "next-common/utils/dv/delegates";
import { isNil, isNumber } from "lodash-es";
import { isBeforeAhm } from "next-common/hooks/useCompatibleMigrationHeight";
import { getReferendumFinishTime } from "next-common/utils/timeline/finish";

/**
 * DV (Decentralized Voices) program existence period — hardcoded block times.
 * Data source: live APIs polkadot-api.subsquare.io / kusama-api.subsquare.io /dv/cohorts
 * - Start time = cohort 1 startIndexer.blockTime (2024-02-26)
 * - End time = last cohort 5 endIndexer.blockTime (2026-01-15)
 *
 * NOTE: use block time instead of block height because after the Asset Hub
 * migration (AHM), referendum indexers report asset-hub heights which are not
 * comparable to the pre-migration relay heights used by earlier cohorts.
 *
 * A referendum is considered within the DV period when its existence
 * (creation ~ end) overlaps this range; referenda outside the range should
 * not show the DV filter.
 */
const dvExistencePeriods = {
  polkadot: {
    startBlockTime: 1708953606000, // cohort 1 start (2024-02-26), relay block 19653189
    endBlockTime: 1768476120000, // cohort 5 end (2026-01-15), relay block 29522352
  },
  kusama: {
    startBlockTime: 1708951272000, // cohort 1 start (2024-02-26), relay block 22045831
    endBlockTime: 1768486368000, // cohort 5 end (2026-01-15), relay block 31841327
  },
};

export function isReferendumInDVPeriod(chain, referendum) {
  const period = dvExistencePeriods[chain];
  if (!period) {
    return false;
  }

  // Creation block time (lifetime start)
  const startTime = referendum?.indexer?.blockTime;
  if (isNil(startTime)) {
    return false;
  }

  // Lifetime end time; an ongoing referendum has no end time,
  // treated as extending to the present
  const endTime = getReferendumFinishTime(
    referendum?.onchainData?.timeline || [],
  );
  const effectiveEnd = isNil(endTime) ? Number.POSITIVE_INFINITY : endTime;

  // 1. Whether the creation time falls within the DV existence period
  const creationInPeriod =
    startTime >= period.startBlockTime && startTime <= period.endBlockTime;

  // 2. Whether the lifetime (creation ~ end) overlaps the DV existence period
  const lifespanOverlaps =
    startTime <= period.endBlockTime && effectiveEnd >= period.startBlockTime;

  return creationInPeriod || lifespanOverlaps;
}

const getFinalBlockHeight = (ahmHeightsOrBlockHeight = null, indexer) => {
  if (
    isNil(ahmHeightsOrBlockHeight) ||
    isNumber(ahmHeightsOrBlockHeight) ||
    isNil(indexer)
  ) {
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
  return slots.find((slot) =>
    isSlotMatched(slot, trackId, voteFinishedIndexer),
  );
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
