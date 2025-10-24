import { range, uniqWith } from "lodash-es";
import { useChainSettings } from "next-common/context/chain";
import { usePageProps } from "next-common/context/page";
import { toPrecision } from "next-common/utils";
import { useMemo } from "react";
import { INDEX_SIZE, toIndex } from "./utils";
import { getCoretimePriceAt } from "next-common/utils/coretime/price";
import useCoretimeCustomizedSaleInfo from "next-common/hooks/coretime/useCoretimeCustomizedSaleInfo";
import useIsCoretimeUseRCBlockNumber from "next-common/hooks/coretime/useIsCoretimeUseRCBlockNumber";

export function useCoretimeStatisticsRenewalsDataset({ initBlockHeightIndex }) {
  const { coretimeSaleRenewalsChart, coretimeSale } = usePageProps();
  const { decimals } = useChainSettings();
  const isUseRCBlockNumber = useIsCoretimeUseRCBlockNumber(coretimeSale.id);

  return useMemo(() => {
    const result = [];
    const indexerKey = isUseRCBlockNumber ? "relayIndexer" : "indexer";

    const data = uniqWith(coretimeSaleRenewalsChart?.items, (a, b) => {
      return (
        a[indexerKey].blockHeight === b[indexerKey].blockHeight &&
        a.price === b.price
      );
    });

    for (let i = 0; i < data.length; i++) {
      const renewal = data[i];

      result.push({
        ...renewal,
        x: toIndex(renewal[indexerKey].blockHeight) - initBlockHeightIndex,
        y: toPrecision(renewal.price, decimals),
      });
    }

    return result;
  }, [
    coretimeSaleRenewalsChart?.items,
    initBlockHeightIndex,
    decimals,
    isUseRCBlockNumber,
  ]);
}

export function useCoretimeStatisticsSalesDataset({ initBlockHeightIndex }) {
  const { coretimeSalePurchasesChart, coretimeSale } = usePageProps();
  const { decimals } = useChainSettings();
  const isUseRCBlockNumber = useIsCoretimeUseRCBlockNumber(coretimeSale.id);

  return useMemo(() => {
    const result = [];
    const indexerKey = isUseRCBlockNumber ? "relayIndexer" : "indexer";

    const data = uniqWith(coretimeSalePurchasesChart?.items, (a, b) => {
      return (
        a[indexerKey].blockHeight === b[indexerKey].blockHeight &&
        a.price === b.price
      );
    });

    for (let i = 0; i < data.length; i++) {
      const sale = data[i];

      result.push({
        ...sale,
        x: toIndex(sale[indexerKey].blockHeight) - initBlockHeightIndex,
        y: toPrecision(sale.price, decimals),
      });
    }

    return result;
  }, [
    coretimeSalePurchasesChart?.items,
    initBlockHeightIndex,
    decimals,
    isUseRCBlockNumber,
  ]);
}

export function useCoretimeStatisticsPriceDataset({
  initBlockHeightIndex,
  saleStart,
  totalBlocksIndex,
}) {
  const { decimals } = useChainSettings();
  const saleInfo = useCoretimeCustomizedSaleInfo();

  return useMemo(() => {
    const steppedBlocksRange = range(
      toIndex(saleStart) - initBlockHeightIndex,
      totalBlocksIndex,
      1,
    );
    return steppedBlocksRange.map((item, index) => {
      const blockHeight = saleStart + index * INDEX_SIZE;
      const price = toPrecision(
        getCoretimePriceAt(blockHeight, saleInfo),
        decimals,
      );

      return {
        blockHeight,
        price,
        x: item,
        y: price,
      };
    });
  }, [saleStart, initBlockHeightIndex, totalBlocksIndex, saleInfo, decimals]);
}
