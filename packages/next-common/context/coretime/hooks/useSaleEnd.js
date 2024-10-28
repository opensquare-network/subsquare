import useCoretimeConfiguration from "next-common/context/coretime/configuration";
import { CORETIME_TIMESLICE_PERIOD } from "next-common/utils/consts/coretime";
import useCoretimeSale from "next-common/context/coretime/sale/provider";
import { useRelayHeight } from "next-common/context/relayInfo";
import { useSelector } from "react-redux";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { isNil } from "lodash-es";

function toEven(num) {
  return num % 2 === 0 ? num : num + 1;
}

// note that the result is evaluated for active sale
export default function useSaleEnd() {
  const relayHeight = useRelayHeight();
  const sale = useCoretimeSale();
  const configuration = useCoretimeConfiguration();
  const { info: { regionEnd } = {}, isFinal, endIndexer } = sale;
  const coretimeHeight = useSelector(chainOrScanHeightSelector);
  if (isFinal && endIndexer) {
    return {
      isLoading: false,
      indexer: endIndexer,
    }
  } else if (isNil(coretimeHeight)) {
    return {
      isLoading: true,
    }
  }

  const advanced = relayHeight + configuration.advanceNotice;
  const currentSlice = Math.floor(advanced / CORETIME_TIMESLICE_PERIOD);

  const sliceGap = regionEnd - currentSlice;
  const regionBlocksGap = sliceGap * CORETIME_TIMESLICE_PERIOD; // coretime 12s, relay 6s, so divide 2.

  const currentSliceRemainingBlocks = CORETIME_TIMESLICE_PERIOD - advanced % CORETIME_TIMESLICE_PERIOD;
  const relayBlocksGap = regionBlocksGap + currentSliceRemainingBlocks;

  const coretimeBlocksGap = Math.ceil(relayBlocksGap / 2);
  return {
    isLoading: false,
    indexer: {
      blockHeight: toEven(coretimeHeight + coretimeBlocksGap),
      blockTime: null, // future block, we have to evaluate the time
    }
  }
}
