import useCoretimeChainOrScanHeight from "next-common/hooks/coretime/scanHeight";
import useCoretimeSale from "next-common/context/coretime/sale/provider";
import { isNil } from "lodash-es";
import useCoretimeSaleStart from "next-common/hooks/coretime/useCoretimeSaleStart";
import { useCoretimeSaleLeadinLength } from "next-common/context/coretime/sale/phases/leadin";

export const Phases = Object.freeze({
  Interlude: "Interlude",
  Leadin: "Leadin",
  FixedPrice: "Fixed Price",
});

export default function useCoretimeSalePhase() {
  const chainHeight = useCoretimeChainOrScanHeight();
  const saleStart = useCoretimeSaleStart();
  const leadinLength = useCoretimeSaleLeadinLength();
  const sale = useCoretimeSale();
  const { initIndexer: { blockHeight: initBlockHeight } = {} } = sale;

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
  if (chainHeight >= initBlockHeight && chainHeight <= saleStart) {
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
