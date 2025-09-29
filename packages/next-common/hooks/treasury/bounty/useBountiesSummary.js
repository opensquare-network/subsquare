import BigNumber from "bignumber.js";
import { useContextApi } from "next-common/context/api";
import { usePageProps } from "next-common/context/page";
import { backendApi } from "next-common/services/nextApi";
import { useEffect, useMemo, useState } from "react";

export function useBountiesSummary() {
  const api = useContextApi();
  const { activeBounties } = usePageProps();
  const [isLoading, setIsLoading] = useState(true);
  const [groupedSummary, setGroupedSummary] = useState(null);
  const [totalBalance, setTotalBalance] = useState(0);
  const [allBounties, setAllBounties] = useState([]);

  const activeBountiesAddresses = useMemo(
    () => activeBounties.map((item) => item.onchainData.address),
    [activeBounties],
  );

  useEffect(() => {
    if (!api) {
      return;
    }

    api?.query?.system?.account?.multi(activeBountiesAddresses, (result) => {
      const list = result.map((item) => item.data.free.toNumber());
      const total = list.reduce(
        (acc, item) => BigNumber(acc).plus(item),
        BigNumber(0),
      );
      setTotalBalance(total.toString());
    });
  }, [api, activeBountiesAddresses]);

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

        setAllBounties(entries);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [api]);

  useEffect(() => {
    if (!allBounties.length) {
      return;
    }
    Promise.all(
      allBounties.map(([idx]) => {
        const bounty = activeBounties.find((item) => item.bountyIndex === +idx);
        if (!bounty) {
          return backendApi
            .fetch(`treasury/bounties/${idx}`)
            .then((res) => res.result);
        }
        return bounty;
      }),
    )
      .then((entries) =>
        entries.map((entry) => {
          const address = entry.onchainData.address;
          if (address) {
            return api?.query?.system
              ?.account(address)
              .then((res) => [entry.state, res.data.free.toNumber()]);
          }
          return [entry.state, entry.onchainData.meta.value];
        }),
      )
      .then(async (values) => await Promise.all(values))
      .then((values) => {});
  }, [allBounties, activeBounties, api]);

  return {
    groupedSummary,
    isLoading,
    totalBalance,
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
