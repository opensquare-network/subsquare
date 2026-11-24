import { isNil } from "lodash-es";
import useCoreFellowshipLatestHeight from "next-common/hooks/fellowship/core/useCoreFellowshipLatestHeight";

export default function useLatestHeightSnapshot() {
  const latestHeight = useCoreFellowshipLatestHeight();
  return {
    isLoading: isNil(latestHeight),
    latestHeight,
  };
}
