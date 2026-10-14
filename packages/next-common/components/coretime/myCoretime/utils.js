import { isNil } from "lodash-es";
import { isSameAddress } from "next-common/utils/isSameAddress";
import { RegionStatus } from "next-common/components/coretime/regions/utils";

export const EMPTY_MY_CORETIME_SUMMARY = {
  regions: 0,
  regionList: [],
  cores: 0,
  coreList: [],
  pendingRenewals: 0,
  pendingRenewalList: [],
  autoRenew: 0,
  autoRenewList: [],
};

// Cores that were paid for by the address, either by renewing a core or by
// purchasing one. `begin` is the timeslice the coretime is valid from, which
// lets us keep only the current and the upcoming period.
export function collectPaidCores({
  renewals = [],
  purchases = [],
  address,
  begins = [],
} = {}) {
  const cores = new Set();
  const wantedBegins = new Set(begins.map((begin) => Number(begin)));

  const collect = (who, begin, core) => {
    if (!isSameAddress(who, address)) {
      return;
    }
    if (
      isNil(begin) ||
      (wantedBegins.size && !wantedBegins.has(Number(begin)))
    ) {
      return;
    }
    if (!isNil(core)) {
      cores.add(Number(core));
    }
  };

  for (const renewal of renewals) {
    collect(renewal?.who, renewal?.begin, renewal?.core);
  }
  for (const purchase of purchases) {
    collect(purchase?.who, purchase?.regionId?.begin, purchase?.regionId?.core);
  }

  return [...cores];
}

// A core counts as mine either because I hold a coretime bought or renewed for
// the current or the upcoming period, because I own a region on it (a pooled
// region is removed from `Regions`, unless it was pooled provisionally), or
// because I contributed a region on it to the coretime pool.
export function buildMyCoretimeSummary({
  regions = [],
  contributions = [],
  paidCores = [],
  renewalByCore = {},
  autoRenewByCore = {},
  address,
} = {}) {
  if (!address) {
    return EMPTY_MY_CORETIME_SUMMARY;
  }

  const myRegions = regions
    .filter(
      (region) =>
        isSameAddress(region?.owner, address) &&
        region.status !== RegionStatus.Expired,
    )
    .sort((a, b) => a.core - b.core || a.begin - b.begin);

  const coreIndexes = new Set();
  const addCore = (core) => {
    if (!isNil(core)) {
      coreIndexes.add(Number(core));
    }
  };

  for (const core of paidCores) {
    addCore(core);
  }
  for (const region of myRegions) {
    addCore(region.core);
  }
  for (const contribution of contributions) {
    if (isSameAddress(contribution?.payee, address)) {
      addCore(contribution.core);
    }
  }

  const coreList = [...coreIndexes].sort((coreA, coreB) => coreA - coreB);

  const pendingRenewalList = [];
  const autoRenewList = [];
  for (const core of coreList) {
    if (autoRenewByCore[core]) {
      autoRenewList.push(core);
    } else if (renewalByCore[core]) {
      pendingRenewalList.push(core);
    }
  }

  return {
    regions: myRegions.length,
    regionList: myRegions,
    cores: coreList.length,
    coreList,
    pendingRenewals: pendingRenewalList.length,
    pendingRenewalList,
    autoRenew: autoRenewList.length,
    autoRenewList,
  };
}
