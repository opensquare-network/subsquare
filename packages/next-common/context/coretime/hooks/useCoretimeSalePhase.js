import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { useSelector } from "react-redux";
import useCoretimeSale from "next-common/context/coretime/sale/provider";
import { isNil } from "lodash-es";

const Phases = Object.freeze({
  Interlude: "Interlude",
  Leadin: "Leadin",
  FixedPrice: "Fixed Price",
});

export default function useCoretimeSalePhase() {
  const chainHeight = useSelector(chainOrScanHeightSelector);
  const sale = useCoretimeSale();
  const { initIndexer: { blockHeight: initBlockHeight } = {}, info: { saleStart, leadinLength } = {} } = sale;

  const isLoading = isNil(chainHeight);
  if (sale.isFinal) {
    return {
      isLoading: false,
      phase: null,
    }
  } else if (isLoading) {
    return {
      isLoading,
      phase: null,
    }
  }

  let phase;
  if (chainHeight >= initBlockHeight && chainHeight <= saleStart) {
    phase = Phases.Interlude;
  } else if (chainHeight > saleStart && chainHeight < saleStart + leadinLength) {
    phase = Phases.Leadin;
  } else {
    phase = Phases.FixedPrice;
  }

  return { isLoading, phase };
}
