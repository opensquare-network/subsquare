import {
  useCoretimeSaleLeadinLength,
  useIsCoretimeSaleLeadinPhase,
} from "next-common/context/coretime/sale/phases/leadin";
import CurrentPhaseEnd from "next-common/components/coretime/salePanel/summary/columns/currentPhase/common";
import { useCoretimeSaleStartWithRCBlockNumber } from "next-common/hooks/coretime/useCoretimeSaleStart";

function LeadinGuard({ children }) {
  const isLeadinPhase = useIsCoretimeSaleLeadinPhase();
  if (!isLeadinPhase) {
    return null;
  }

  return children;
}

export default function MaybeLeadinEnd() {
  const saleStartHeight = useCoretimeSaleStartWithRCBlockNumber();
  const leadinLength = useCoretimeSaleLeadinLength();

  return (
    <LeadinGuard>
      <CurrentPhaseEnd
        startHeight={saleStartHeight}
        endHeight={saleStartHeight + leadinLength}
      />
    </LeadinGuard>
  );
}
