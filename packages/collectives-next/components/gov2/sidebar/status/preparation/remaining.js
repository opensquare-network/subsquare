import { useSelector } from "react-redux";
import { useSubmittedAt } from "next-common/context/post/gov2/referendum";
import { usePreparation } from "next-common/context/post/gov2/track";
import { isNil } from "lodash-es";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";

export function usePrepareRemaining() {
  const latestHeight = useSelector(chainOrScanHeightSelector);
  const submittedAt = useSubmittedAt();
  const prepareBlocks = usePreparation();

  if (isNil(latestHeight)) {
    return 0;
  }

  const gone = latestHeight - submittedAt;
  if (gone > prepareBlocks) {
    return 0;
  } else {
    return prepareBlocks - gone;
  }
}
