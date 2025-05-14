import useCoretimeConfiguration from "next-common/context/coretime/configuration";
import { CORETIME_TIMESLICE_PERIOD } from "next-common/utils/consts/coretime";
import useCoretimeSale from "next-common/context/coretime/sale/provider";
import { useRelayHeight } from "next-common/context/relayInfo";
import useChainOrScanHeight from "next-common/hooks/height";
import { isNil } from "lodash-es";

function toEven(num) {
  return num % 2 === 0 ? num : num + 1;
}

// note that the result is evaluated for active sale
export default function useCoretimeSaleEnd() {
  const relayHeight = useRelayHeight();
  const sale = useCoretimeSale();
  const configuration = useCoretimeConfiguration();
  const { info: { regionBegin } = {}, isFinal, endIndexer } = sale;
  const coretimeHeight = useChainOrScanHeight();
  if (isFinal && endIndexer) {
    return {
      isLoading: false,
      indexer: endIndexer,
    };
  } else if (isNil(coretimeHeight) || isNil(relayHeight)) {
    return {
      isLoading: true,
    };
  }

  const relayEndBlock =
    (regionBegin + 1) * CORETIME_TIMESLICE_PERIOD - configuration.advanceNotice;
  const relayBlocksGap = relayEndBlock - relayHeight;
  const coretimeBlocksGap = Math.ceil(relayBlocksGap / 2);
  return {
    isLoading: false,
    indexer: {
      blockHeight: toEven(coretimeHeight + coretimeBlocksGap),
      blockTime: null, // future block, we have to evaluate the time
    },
  };
}
