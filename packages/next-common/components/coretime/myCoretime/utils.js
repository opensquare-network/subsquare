import { isNil } from "lodash-es";
import { isSameAddress } from "next-common/utils/isSameAddress";
import { RegionStatus } from "next-common/components/coretime/regions/utils";

export const EMPTY_MY_CORETIME_SUMMARY = {
  regions: 0,
  cores: 0,
  pendingRenewals: 0,
  autoRenew: 0,
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

  const myRegions = regions.filter(
    (region) =>
      isSameAddress(region?.owner, address) &&
      region.status !== RegionStatus.Expired,
  );

  const cores = new Set(myRegions.map((region) => region.core));
  for (const contribution of contributions) {
    if (isSameAddress(contribution?.payee, address)) {
      cores.add(contribution.core);
    }
  }
  for (const core of paidCores) {
    cores.add(core);
  }

  let pendingRenewals = 0;
  let autoRenew = 0;
  for (const core of cores) {
    if (autoRenewByCore[core]) {
      autoRenew += 1;
    } else if (renewalByCore[core]) {
      pendingRenewals += 1;
    }
  }

  return {
    regions: myRegions.length,
    cores: cores.size,
    pendingRenewals,
    autoRenew,
  };
}
