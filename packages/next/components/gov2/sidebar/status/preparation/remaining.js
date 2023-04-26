import { useSelector } from "react-redux";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import { useSubmittedAt } from "next-common/context/post/gov2/referendum";
import { usePreparation } from "next-common/context/post/gov2/track";
import isNil from "lodash.isnil";

export function usePrepareRemaining() {
  const latestHeight = useSelector(latestHeightSelector);
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
