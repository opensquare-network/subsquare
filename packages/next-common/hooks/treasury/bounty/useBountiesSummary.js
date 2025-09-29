import BigNumber from "bignumber.js";
import { useContextApi } from "next-common/context/api";
import { usePageProps } from "next-common/context/page";
import { backendApi } from "next-common/services/nextApi";
import { useEffect, useState } from "react";
import { mapValues, groupBy, toNumber } from "lodash-es";

const STATUSES = ["Active", "Funded", "Proposed", "Approved"];

export function useBountiesSummary() {
  const api = useContextApi();
  const { activeBounties = [] } = usePageProps();
  const [isLoading, setIsLoading] = useState(true);
  const [groupedTotal, setGroupedTotal] = useState(null);
  const [totalBalance, setTotalBalance] = useState(0);
  const [allBounties, setAllBounties] = useState([]);

  useEffect(() => {
    if (!api) {
      return;
    }

    setIsLoading(true);
    api?.query.bounties?.bounties
      ?.entries()
      .then((result) => {
        const bounties = result.map(([entryIndex, value]) => {
          const [id] = entryIndex.toHuman() || [];
          return [id, value];
        });
        setAllBounties(bounties);
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
        const bounty = activeBounties.find(
          (item) => item.bountyIndex === toNumber(idx),
        );
        if (!bounty) {
          return backendApi
            .fetch(`treasury/bounties/${idx}`)
            .then((res) => res.result);
        }
        return bounty;
      }),
    )
      .then(async (bounties) =>
        Promise.all(
          bounties.map((bountie) => {
            const address = bountie?.onchainData?.address;
            if (address) {
              return api?.query?.system
                ?.account(address)
                .then((res) => [bountie.state, res.data.free.toNumber()]);
            }
            return [bountie.state, bountie?.onchainData?.value || 0];
          }),
        ),
      )
      .then((values) => {
        const groupedValues = groupBy(values, 0);
        const groupedTotal = mapValues(groupedValues, (values) => {
          return {
            total: values.reduce(
              (acc, value) => BigNumber(acc).plus(value[1]),
              BigNumber(0),
            ),
            count: values.length,
          };
        });

        const finalGroupedTotal = {};
        STATUSES.forEach((status) => {
          finalGroupedTotal[status] = groupedTotal[status] || {
            total: BigNumber(0),
            count: 0,
          };
        });

        // don't include proposed
        setTotalBalance(
          [
            finalGroupedTotal.Active?.total,
            finalGroupedTotal.Funded?.total,
            finalGroupedTotal.Approved?.total,
          ].reduce((acc, value) => BigNumber(acc).plus(value), BigNumber(0)),
        );

        // don't include approved if there are no approved bounties
        if (finalGroupedTotal.Approved?.count === 0) {
          delete finalGroupedTotal.Approved;
        }

        setGroupedTotal(finalGroupedTotal);
      });
  }, [allBounties, activeBounties, api]);

  return {
    groupedTotal,
    isLoading,
    totalBalance,
  };
}
