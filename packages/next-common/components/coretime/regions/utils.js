import BigNumber from "bignumber.js";

export const REGION_MASK_BITS = 80;

export const RegionStatus = {
  Active: "Active",
  Expired: "Expired",
  Upcoming: "Upcoming",
};

export function countRegionMaskBits(mask = "") {
  const binary = new BigNumber(mask || 0, 16).toString(2);
  return binary.match(/1/g)?.length ?? 0;
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
  const percentage = (parts / REGION_MASK_BITS) * 100;

  return {
    parts,
    percentage: Number.parseFloat(percentage.toFixed(2)),
  };
}

export function formatRegionEntry(
  { keyArgs: [regionId], value },
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
