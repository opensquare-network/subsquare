import {
  useCoretimeSaleLeadinLength,
  useIsCoretimeSaleLeadinPhase,
} from "next-common/context/coretime/sale/phases/leadin";
import { useCoretimeSaleStart } from "next-common/context/coretime/sale/provider";
import CurrentPhaseEnd from "next-common/components/coretime/salePanel/summary/columns/currentPhase/common";

function LeadinGuard({ children }) {
  const isLeadinPhase = useIsCoretimeSaleLeadinPhase();
  if (!isLeadinPhase) {
    return null;
  }

  return children;
}

export default function MaybeLeadinEnd() {
  const saleStartHeight = useCoretimeSaleStart();
  const leadinLength = useCoretimeSaleLeadinLength();

  return (
    <LeadinGuard>
      <CurrentPhaseEnd startHeight={saleStartHeight} endHeight={saleStartHeight + leadinLength} />
    </LeadinGuard>
  );
}
