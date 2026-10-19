import { useCallback } from "react";
import { useRouter } from "next/router";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import { MapDataList } from "next-common/components/dataList";
import { PriceDirectionProvider } from "./columns/price";

export default function LiquidPoolsTable({ pools, loading, columnsDef }) {
  const router = useRouter();
  const onRowClick = useCallback(
    (pool) => {
      router.push(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            tab: "swap",
            tokenIn: pool.token1.key,
            tokenOut: pool.token2.key,
          },
        },
        undefined,
        { shallow: true },
      );
    },
    [router],
  );

  return (
    <PriceDirectionProvider>
      <ScrollerX>
        <MapDataList
          columnsDef={columnsDef}
          data={pools}
          getRowKey={(pool) => pool.poolAssetId}
          onRowClick={onRowClick}
          loading={loading}
          noDataText="No liquidity pools"
        />
      </ScrollerX>
    </PriceDirectionProvider>
  );
}
