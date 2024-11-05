import { range, uniqWith } from "lodash-es";
import { useChainSettings } from "next-common/context/chain";
import { usePageProps } from "next-common/context/page";
import { toPrecision } from "next-common/utils";
import { useMemo } from "react";
import { INDEX_SIZE, toIndex } from "./utils";
import { getCoretimePriceAt } from "next-common/utils/coretime/price";

export function useCoretimeStatisticsRenewalsDataset({ initBlockHeightIndex }) {
  const { coretimeSaleRenewalsChart } = usePageProps();
  const { decimals } = useChainSettings();

  return useMemo(() => {
    const result = [];

    const data = uniqWith(coretimeSaleRenewalsChart?.items, (a, b) => {
      return (
        a.indexer.blockHeight === b.indexer.blockHeight && a.price === b.price
      );
    });

    for (let i = 0; i < data.length; i++) {
      const renewal = data[i];

      result.push({
        ...renewal,
        x: toIndex(renewal.indexer.blockHeight) - initBlockHeightIndex,
        y: toPrecision(renewal.price, decimals),
      });
    }

    return result;
  }, [coretimeSaleRenewalsChart?.items, initBlockHeightIndex, decimals]);
}

export function useCoretimeStatisticsSalesDataset({ initBlockHeightIndex }) {
  const { coretimeSalePurchasesChart } = usePageProps();
  const { decimals } = useChainSettings();

  return useMemo(() => {
    const result = [];

    const data = uniqWith(coretimeSalePurchasesChart?.items, (a, b) => {
      return (
        a.indexer.blockHeight === b.indexer.blockHeight && a.price === b.price
      );
    });

    for (let i = 0; i < data.length; i++) {
      const sale = data[i];

      result.push({
        ...sale,
        x: toIndex(sale.indexer.blockHeight) - initBlockHeightIndex,
        y: toPrecision(sale.price, decimals),
      });
    }

    return result;
  }, [coretimeSalePurchasesChart?.items, initBlockHeightIndex, decimals]);
}

export function useCoretimeStatisticsPriceDataset({
  initBlockHeightIndex,
  saleStart,
  fixedStart,
  coretimeSale,
}) {
  const { decimals } = useChainSettings();

  return useMemo(() => {
    const steppedBlocksRange = [
      ...range(saleStart, fixedStart, INDEX_SIZE),
      fixedStart,
    ];

    return steppedBlocksRange.map((blockHeight) => {
      const price = toPrecision(
        getCoretimePriceAt(blockHeight, coretimeSale.info),
        decimals,
      );

      return {
        blockHeight,
        price,
        x: toIndex(blockHeight) - initBlockHeightIndex,
        y: price,
      };
    });
  }, [
    coretimeSale.info,
    decimals,
    fixedStart,
    saleStart,
    initBlockHeightIndex,
  ]);
}
