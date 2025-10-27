import {
  useCoretimeSaleLeadinEnd,
  useCoretimeSaleLeadinLength,
} from "next-common/context/coretime/sale/phases/leadin";
import { useRelayChainLatestHeight } from "next-common/hooks/relayScanHeight";
import CurrentPhaseEnd from "next-common/components/coretime/salePanel/summary/columns/currentPhase/common";
import { useCoretimeSaleEndWithRelayHeight } from "next-common/context/coretime/hooks/useCoretimeSaleEnd";
import { useCoretimeSaleStartWithRCBlockNumber } from "next-common/hooks/coretime/useCoretimeSaleStart";

function FixPricePhaseGuard({ children }) {
  const saleStartHeight = useCoretimeSaleStartWithRCBlockNumber();
  const leadinLength = useCoretimeSaleLeadinLength();
  const chainHeight = useRelayChainLatestHeight();

  if (chainHeight < saleStartHeight + leadinLength) {
    return null;
  }

  return children;
}

export default function MaybeFixedPriceEnd() {
  const leadinEnd = useCoretimeSaleLeadinEnd();
  const { isLoading, indexer } = useCoretimeSaleEndWithRelayHeight();

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
