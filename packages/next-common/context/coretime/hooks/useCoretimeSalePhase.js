import { useRelayChainLatestHeight } from "next-common/hooks/relayScanHeight";
import useCoretimeSale from "next-common/context/coretime/sale/provider";
import { isNil } from "lodash-es";
import { useCoretimeSaleStartWithRCBlockNumber } from "next-common/hooks/coretime/useCoretimeSaleStart";
import { useCoretimeSaleLeadinLength } from "next-common/context/coretime/sale/phases/leadin";

export const Phases = Object.freeze({
  Interlude: "Interlude",
  Leadin: "Leadin",
  FixedPrice: "Fixed Price",
});

export default function useCoretimeSalePhase() {
  const chainHeight = useRelayChainLatestHeight();
  const saleStart = useCoretimeSaleStartWithRCBlockNumber();
  const leadinLength = useCoretimeSaleLeadinLength();
  const sale = useCoretimeSale();
  const { relayIndexer: { blockHeight: relayBlockHeight } = {} } = sale;

  const isLoading = isNil(chainHeight);
  if (sale.isFinal) {
    return {
      isLoading: false,
      phase: null,
    };
  } else if (isLoading) {
    return {
      isLoading,
      phase: null,
    };
  }

  let phase;
  if (chainHeight >= relayBlockHeight && chainHeight <= saleStart) {
    phase = Phases.Interlude;
  } else if (
    chainHeight > saleStart &&
    chainHeight < saleStart + leadinLength
  ) {
    phase = Phases.Leadin;
  } else {
    phase = Phases.FixedPrice;
  }

  return { isLoading, phase };
}
