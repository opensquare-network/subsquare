import useCoretimeConfiguration from "next-common/context/coretime/configuration";
import { CORETIME_TIMESLICE_PERIOD } from "next-common/utils/consts/coretime";
import useCoretimeSale from "next-common/context/coretime/sale/provider";
import { useRelayChainLatestHeight } from "next-common/hooks/relayScanHeight";
import { isNil } from "lodash-es";
import useIsCoretimeUseRCBlockNumber from "next-common/hooks/coretime/useIsCoretimeUseRCBlockNumber";

function toEven(num) {
  return num % 2 === 0 ? num : num + 1;
}

// note that the result is evaluated for active sale
export default function useCoretimeSaleEnd() {
  const relayHeight = useRelayChainLatestHeight();
  const sale = useCoretimeSale();
  const configuration = useCoretimeConfiguration();
  const {
    id,
    info: { regionBegin } = {},
    isFinal,
    endRelayIndexer,
    endIndexer,
  } = sale;
  const isUseRCBlockNumber = useIsCoretimeUseRCBlockNumber(id);
  const finalEndIndexer = isUseRCBlockNumber ? endRelayIndexer : endIndexer;
  if (isFinal && finalEndIndexer) {
    return {
      isLoading: false,
      indexer: finalEndIndexer,
    };
  } else if (isNil(relayHeight)) {
    return {
      isLoading: true,
    };
  }

  const relayEndBlock =
    (regionBegin + 1) * CORETIME_TIMESLICE_PERIOD - configuration.advanceNotice;
  const relayBlocksGap = relayEndBlock - relayHeight;

  return {
    isLoading: false,
    indexer: {
      blockHeight: toEven(relayHeight + relayBlocksGap),
      blockTime: null, // future block, we have to evaluate the time
    },
  };
}
