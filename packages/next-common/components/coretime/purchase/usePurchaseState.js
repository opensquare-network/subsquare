import { useContextApi } from "next-common/context/api";
import useCoretimeSale from "next-common/context/coretime/sale/provider";
import useCoretimeStatus from "next-common/context/coretime/status";
import useCoretimeSalePrice from "next-common/context/coretime/hooks/useCoretimeSalePrice";
import useCoretimeSaleStart from "next-common/hooks/coretime/useCoretimeSaleStart";
import { useRelayChainLatestHeight } from "next-common/hooks/relayScanHeight";

export default function usePurchaseState(regionBegin) {
  const api = useContextApi();
  const { info: saleInfo, isFinal } = useCoretimeSale();
  const status = useCoretimeStatus();
  const relayHeight = useRelayChainLatestHeight();
  const saleStart = useCoretimeSaleStart();
  const { price, isLoading } = useCoretimeSalePrice();

  let error = null;
  if (!api) {
    error = "Connecting to the Coretime chain";
  } else if (!api.tx?.broker?.purchase) {
    error = "Coretime purchases are not available on this connection";
  } else if (isLoading || !saleInfo || !status) {
    error = "Waiting for current sale data";
  } else if (isFinal || saleInfo.regionBegin !== regionBegin) {
    error =
      "The sale has changed. Reopen the purchase dialog for the current sale.";
  } else if (relayHeight <= saleStart) {
    error = "Purchases open after the interlude period";
  } else if (
    saleInfo.coresSold >= saleInfo.coresOffered ||
    saleInfo.firstCore + saleInfo.coresSold >= status.coreCount
  ) {
    error = "No cores are available for purchase";
  }

  return {
    error,
    price: error ? null : price,
  };
}
