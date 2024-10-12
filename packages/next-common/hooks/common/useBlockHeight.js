import { isNil } from "lodash-es";
import { useChainState } from "next-common/context/chain";

export function useBlockHeight() {
  const [{ latestHeight, scanHeight }] = useChainState();

  if (isNil(latestHeight)) {
    return scanHeight;
  }

  return latestHeight;
}
