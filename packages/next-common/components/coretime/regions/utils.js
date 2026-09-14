import BigNumber from "bignumber.js";
import { BN, bnToHex, hexToBn, hexToU8a, isHex } from "@polkadot/util";

export const RegionStatus = {
  Active: "Active",
  Expired: "Expired",
  Upcoming: "Upcoming",
};

export function countRegionMaskBits(mask = "") {
  const binary = new BigNumber(mask || 0, 16).toString(2);
  return binary.match(/1/g)?.length ?? 0;
}

export function getPartitionOffset(begin, end, inputPercentage) {
  const percentage = new BigNumber(inputPercentage);
  if (!percentage.isFinite() || percentage.lte(0) || percentage.gte(100)) {
    return null;
  }

  const duration = new BigNumber(end).minus(begin);
  const offset = duration
    .times(percentage)
    .dividedBy(100)
    .integerValue(BigNumber.ROUND_HALF_UP);
  if (!offset.isFinite() || offset.lte(0) || offset.gte(duration)) {
    return null;
  }

  return offset.toFixed(0);
}

export function getPartitionDuration(begin, end, inputPivot) {
  const pivot = new BigNumber(inputPivot);
  const duration = new BigNumber(end).minus(begin);
  if (!pivot.isFinite() || !pivot.isInteger()) {
    return null;
  }
  if (pivot.lte(0) || pivot.gte(duration)) {
    return null;
  }
  return pivot;
}

export function createInterlaceMask(mask, inputParts) {
  const parts = new BigNumber(inputParts);
  if (
    !isHex(mask) ||
    !parts.isInteger() ||
    parts.lte(0) ||
    parts.gte(countRegionMaskBits(mask))
  ) {
    return null;
  }

  const regionMask = hexToBn(mask);
  const bitLength = hexToU8a(mask).length * 8;
  const pivot = new BN(0);
  let remainingParts = parts.toNumber();
  for (let bit = bitLength - 1; bit >= 0 && remainingParts > 0; bit -= 1) {
    if (regionMask.testn(bit)) {
      pivot.setn(bit, true);
      remainingParts -= 1;
    }
  }

  return bnToHex(pivot, { bitLength });
}

export function getRegionStatus(begin, end, currentTimeslice) {
  if (currentTimeslice < begin) {
    return RegionStatus.Upcoming;
  }

  if (currentTimeslice >= end) {
    return RegionStatus.Expired;
  }

  return RegionStatus.Active;
}

export function formatRegionShare(mask) {
  const parts = countRegionMaskBits(mask);
  const totalParts = hexToU8a(mask).length * 8;
  const percentage = (parts / totalParts) * 100;

  return {
    parts,
    totalParts,
    percentage: Number.parseFloat(percentage.toFixed(2)),
  };
}

export function formatRegionEntry(
  { args: [regionId], value },
  currentTimeslice,
  timeslicePeriod,
) {
  const { begin, core, mask } = regionId;
  const { end, owner, paid } = value;

  return {
    begin,
    core,
    end,
    mask,
    owner,
    paid,
    startRelayBlock: begin * timeslicePeriod,
    endRelayBlock: end * timeslicePeriod,
    status: getRegionStatus(begin, end, currentTimeslice),
    ...formatRegionShare(mask),
  };
}
