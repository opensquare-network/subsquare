import useCoretimeSale from "next-common/context/coretime/sale/provider";
import { useRelayChainLatestHeight } from "next-common/hooks/relayScanHeight";
import useCoretimeSaleStart from "next-common/hooks/coretime/useCoretimeSaleStart";

export function useCoretimeSaleLeadinLength() {
  const sale = useCoretimeSale();
  const { info: { leadinLength } = {} } = sale;
  return leadinLength;
}

export function useCoretimeSaleLeadinEnd() {
  const saleStartHeight = useCoretimeSaleStart();
  const leadinLength = useCoretimeSaleLeadinLength();

  return saleStartHeight + leadinLength;
}

export function useIsCoretimeSaleLeadinPhase() {
  const saleStartHeight = useCoretimeSaleStart();
  const leadinLength = useCoretimeSaleLeadinLength();
  const chainHeight = useRelayChainLatestHeight();

  return (
    chainHeight >= saleStartHeight &&
    chainHeight < saleStartHeight + leadinLength
  );
}
