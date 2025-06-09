import useCoretimeChainOrScanHeight from "next-common/hooks/coretime/scanHeight";
import useCoretimeSale from "next-common/context/coretime/sale/provider";
import { isNil } from "lodash-es";

export default function useCoretimeSaleIsInterlude() {
  const chainHeight = useCoretimeChainOrScanHeight();
  const sale = useCoretimeSale() || {};
  const {
    initIndexer: { blockHeight: initBlockHeight } = {},
    info: { saleStart } = {},
  } = sale;

  const isLoading = isNil(chainHeight);

  const isHistoricalSale = "endIndexer" in sale;
  if (isHistoricalSale) {
    return {
      isLoading: false,
      isInterludePhase: false,
    };
  }

  const isInterludePhase =
    chainHeight >= initBlockHeight && chainHeight <= saleStart;

  return {
    isLoading,
    isInterludePhase,
  };
}
