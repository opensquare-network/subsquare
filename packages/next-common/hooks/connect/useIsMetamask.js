import { findIndex } from "lodash-es";
import { useDetectEthereum } from "./useDetectEthereum";

const KEY = "isMetaMask";

export function useIsMetamaskWallet() {
  const ethereum = useDetectEthereum();
  const idx = findIndex(ethereum?.providers, KEY);

  return ethereum?.[KEY] || idx >= 0;
}
