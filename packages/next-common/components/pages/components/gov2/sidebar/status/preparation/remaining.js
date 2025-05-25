import { useSubmittedAt } from "next-common/context/post/gov2/referendum";
import { usePreparation } from "next-common/context/post/gov2/track";
import { isNil } from "lodash-es";
import { useAhmLatestHeight } from "next-common/hooks/useCompatibleMigrationHeight";

export function usePrepareRemaining() {
  const latestHeight = useAhmLatestHeight();
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
