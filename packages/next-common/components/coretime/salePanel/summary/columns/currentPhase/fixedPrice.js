import {
  useCoretimeSaleLeadinEnd,
  useCoretimeSaleLeadinLength,
} from "next-common/context/coretime/sale/phases/leadin";
import useAlwaysRelayHeight from "next-common/hooks/useAlwaysRelayHeight";
import CurrentPhaseEnd from "next-common/components/coretime/salePanel/summary/columns/currentPhase/common";
import useCoretimeSaleEnd from "next-common/context/coretime/hooks/useCoretimeSaleEnd";
import useCoretimeSaleStart from "next-common/hooks/coretime/useCoretimeSaleStart";

function FixPricePhaseGuard({ children }) {
  const saleStartHeight = useCoretimeSaleStart();
  const leadinLength = useCoretimeSaleLeadinLength();
  const chainHeight = useAlwaysRelayHeight();

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
