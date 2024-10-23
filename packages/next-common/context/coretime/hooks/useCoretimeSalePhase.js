import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { useSelector } from "react-redux";
import useCoretimeSale from "next-common/context/coretime/sale/provider";
import useCoretimeConfiguration from "next-common/context/coretime/configuration";
import { useMemo } from "react";

const Phases = Object.freeze({
  Interlude: "Interlude",
  Leadin: "Leadin",
  FixedPrice: "Fixed Price",
});

export default function useCoretimeSalePhase() {
  const chainHeight = useSelector(chainOrScanHeightSelector);
  const sale = useCoretimeSale();
  const configuration = useCoretimeConfiguration();
  const { initIndexer: { blockHeight: initBlockHeight } = {}, info: { saleStart, leadinLength } = {} } = sale;
  const { interludeLength } = configuration;

  const isInterludePhase = useMemo(() => {
    return chainHeight >= initBlockHeight && chainHeight <= saleStart;
  }, [chainHeight, initBlockHeight, interludeLength]);

  const isLeadinPhase = useMemo(() => {
    return chainHeight > saleStart && chainHeight < saleStart + leadinLength;
  }, [chainHeight, saleStart, leadinLength]);

  if (sale.isFinal) {
    return null;
  }

  if (isInterludePhase) {
    return Phases.Interlude;
  } else if (isLeadinPhase) {
    return Phases.Leadin;
  } else {
    return Phases.FixedPrice;
  }
}
