import BigNumber from "bignumber.js";
import { useContextPapiApi } from "next-common/context/papi";
import { usePageProps } from "next-common/context/page";
import { useChainSettings } from "next-common/context/chain";
import { backendApi } from "next-common/services/nextApi";
import { getAssetInfoFromAssetKind } from "next-common/utils/treasury/multiAssetBounty/assetKind";
import { useEffect, useState } from "react";
import { groupBy, mapValues, toNumber } from "lodash-es";

const ACTIVE_STATUSES = ["Funded", "CuratorUnassigned", "Active"];

/**
 * Fetches all multi-asset bounties from chain via papi, groups by status.
 * Each status entry contains per-asset totals.
 *
 * Returns:
 *   groupedByStatus: { [status]: { count, byAsset: { [symbol]: { symbol, decimals, count, total } } } }
 *   groupedByAsset:  { [symbol]: { symbol, decimals, total } } — totals across active statuses
 *   isLoading: boolean
 */
export function useMultiAssetBountiesSummary() {
  const papi = useContextPapiApi();
  const { activeBounties = [] } = usePageProps();
  const { decimals: chainDecimals, symbol: chainSymbol } = useChainSettings();
  const [isLoading, setIsLoading] = useState(true);
  const [groupedByStatus, setGroupedByStatus] = useState(null);
  const [groupedByAsset, setGroupedByAsset] = useState({});

  useEffect(() => {
    if (!papi) {
      return;
    }

    papi.query.MultiAssetBounties.Bounties.getEntries()
      .then((result) => {
        const allEntries = result.map(({ keyArgs }) => {
          const [id] = keyArgs || [];
          return id;
        });

        return Promise.all(
          allEntries.map((idx) => {
            const found = activeBounties.find(
              (item) => item.bountyIndex === toNumber(idx),
            );
            if (found) {
              return found;
            }
            return backendApi
              .fetch(`treasury/multi-asset-bounties/${idx}`)
              .then((res) => res.result);
          }),
        );
      })
      .then((bounties) => {
        const byStatus = groupBy(bounties, "state");

        // For each status group, compute per-asset totals
        const grouped = mapValues(byStatus, (items) => {
          const byAsset = {};
          items.forEach((bounty) => {
            const assetKind = bounty?.onchainData?.assetKind;
            const { symbol, decimals } = getAssetInfoFromAssetKind(
              assetKind,
              chainDecimals,
              chainSymbol,
            );
            if (!byAsset[symbol]) {
              byAsset[symbol] = {
                symbol,
                decimals,
                count: 0,
                total: BigNumber(0),
              };
            }
            byAsset[symbol].count += 1;
            byAsset[symbol].total = byAsset[symbol].total.plus(
              bounty?.onchainData?.value || 0,
            );
          });
          return { count: items.length, byAsset };
        });

        // Only keep active statuses
        const finalGrouped = {};
        ACTIVE_STATUSES.forEach((status) => {
          if (grouped[status]) {
            finalGrouped[status] = grouped[status];
          }
        });
        setGroupedByStatus(finalGrouped);

        // Aggregate per-asset totals across all active statuses
        const overallByAsset = {};
        ACTIVE_STATUSES.forEach((status) => {
          Object.values(grouped[status]?.byAsset || {}).forEach(
            ({ symbol, decimals, total }) => {
              if (!overallByAsset[symbol]) {
                overallByAsset[symbol] = {
                  symbol,
                  decimals,
                  total: BigNumber(0),
                };
              }
              overallByAsset[symbol].total =
                overallByAsset[symbol].total.plus(total);
            },
          );
        });
        setGroupedByAsset(overallByAsset);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [papi, activeBounties, chainDecimals, chainSymbol]);

  return { groupedByStatus, groupedByAsset, isLoading };
}
