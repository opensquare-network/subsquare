import { useRelayChainLatestHeight } from "next-common/hooks/relayScanHeight";
import useCoretimeSale from "next-common/context/coretime/sale/provider";
import { isNil } from "lodash-es";

export default function useCoretimeSaleIsInterlude() {
  const chainHeight = useRelayChainLatestHeight();
  const sale = useCoretimeSale() || {};
  const {
    relayIndexer: { blockHeight: relayBlockHeight } = {},
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
    chainHeight >= relayBlockHeight && chainHeight <= saleStart;

  return {
    isLoading,
    isInterludePhase,
  };
}
