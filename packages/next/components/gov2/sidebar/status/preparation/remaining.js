import { useSubmittedAt } from "next-common/context/post/gov2/referendum";
import { usePreparation } from "next-common/context/post/gov2/track";
import { isNil } from "lodash-es";
import { useBlockHeight } from "next-common/hooks/common/useBlockHeight";

export function usePrepareRemaining() {
  const latestHeight = useBlockHeight();
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
