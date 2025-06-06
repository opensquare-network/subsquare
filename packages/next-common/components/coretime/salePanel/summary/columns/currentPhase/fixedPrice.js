import {
  useCoretimeSaleLeadinEnd,
  useCoretimeSaleLeadinLength,
} from "next-common/context/coretime/sale/phases/leadin";
import { useCoretimeSaleStart } from "next-common/context/coretime/sale/provider";
import useCoretimeChainOrScanHeight from "next-common/hooks/coretime/scanHeight";
import CurrentPhaseEnd from "next-common/components/coretime/salePanel/summary/columns/currentPhase/common";
import useCoretimeSaleEnd from "next-common/context/coretime/hooks/useCoretimeSaleEnd";

function FixPricePhaseGuard({ children }) {
  const saleStartHeight = useCoretimeSaleStart();
  const leadinLength = useCoretimeSaleLeadinLength();
  const chainHeight = useCoretimeChainOrScanHeight();

  if (chainHeight < saleStartHeight + leadinLength) {
    return null;
  }

  return children;
}

export default function MaybeFixedPriceEnd() {
  const leadinEnd = useCoretimeSaleLeadinEnd();
  const { isLoading, indexer } = useCoretimeSaleEnd();
  if (isLoading) {
    return null;
  }

  return (
    <FixPricePhaseGuard>
      <CurrentPhaseEnd
        startHeight={leadinEnd}
        endHeight={indexer.blockHeight}
      />
    </FixPricePhaseGuard>
  );
}
