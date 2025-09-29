import BigNumber from "bignumber.js";
import { useContextApi } from "next-common/context/api";
import { useEffect, useState } from "react";

export function useBountiesSummary() {
  const api = useContextApi();
  const [isLoading, setIsLoading] = useState(true);
  const [groupedSummary, setGroupedSummary] = useState(null);

  useEffect(() => {
    if (!api) {
      return;
    }

    setIsLoading(true);
    api.query.bounties.bounties
      .entries()
      .then((result) => {
        const entries = result.map(([entryIndex, value]) => {
          const [id] = entryIndex.toHuman() || [];
          return [id, value];
        });
        const groupedSummary = getGroupedSummary(entries);
        setGroupedSummary(groupedSummary);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [api]);

  return {
    groupedSummary,
    isLoading,
  };
}

function getGroupedSummary(bounties = []) {
  let allTotal = new BigNumber(0);
  const groupedMap = {
    Active: {
      total: new BigNumber(0),
      count: 0,
    },
    Funded: {
      total: new BigNumber(0),
      count: 0,
    },
    Proposed: {
      total: new BigNumber(0),
      count: 0,
    },
    Approved: {
      total: new BigNumber(0),
      count: 0,
    },
  };

  for (const item of bounties) {
    const data = item[1];
    const status = data.value.status;
    const json = data.toJSON();
    const value = json.value || 0;

    if (!status.isProposed) {
      // proposed are not included in the total
      allTotal = allTotal.plus(value);
    }
    if (status.isActive || status.isPendingPayout) {
      groupedMap.Active.count++;
      groupedMap.Active.total = groupedMap.Active.total.plus(value);
    } else if (status.isFunded || status.isCuratorProposed) {
      groupedMap.Funded.count++;
      groupedMap.Funded.total = groupedMap.Funded.total.plus(value);
    } else if (status.isProposed) {
      groupedMap.Proposed.count++;
      groupedMap.Proposed.total = groupedMap.Proposed.total.plus(value);
    } else if (status.isApproved || status.isApprovedWithCurator) {
      groupedMap.Approved.count++;
      groupedMap.Approved.total = groupedMap.Approved.total.plus(value);
    }
  }

  if (groupedMap.Approved.count === 0) {
    // if there are no approved bounties, don't show the approved group
    delete groupedMap.Approved;
  }

  return {
    total: allTotal,
    groupedTotal: groupedMap,
  };
}
