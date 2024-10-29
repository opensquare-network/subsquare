import { useCoretimeSaleInitHeight, useCoretimeSaleStart } from "next-common/context/coretime/sale/provider";
import { useIsCoretimeSaleInterludePhase } from "next-common/context/coretime/sale/phases/interlude";
import CurrentPhaseEnd from "next-common/components/coretime/salePanel/summary/columns/currentPhase/common";

function InterludeGuard({ children }) {
  const isInterludePhase = useIsCoretimeSaleInterludePhase();
  if (!isInterludePhase) {
    return null;
  }

  return children;
}

export default function MaybeInterludeEnd() {
  const saleStartHeight = useCoretimeSaleStart();
  const initHeight = useCoretimeSaleInitHeight();

  return (
    <InterludeGuard>
      <CurrentPhaseEnd startHeight={initHeight} endHeight={saleStartHeight} />
    </InterludeGuard>
  );
}
