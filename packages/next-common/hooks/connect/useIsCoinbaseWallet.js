import { findIndex } from "lodash-es";
import { useDetectEthereum } from "./useDetectEthereum";

const KEY = "isCoinbaseWallet";

export function useIsCoinbaseWallet() {
  const ethereum = useDetectEthereum();
  const idx = findIndex(ethereum?.providers, KEY);

  return ethereum?.[KEY] || idx >= 0;
}
