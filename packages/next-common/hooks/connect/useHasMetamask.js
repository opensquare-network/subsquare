import { findIndex } from "lodash-es";
import { useDetectEthereum } from "./useDetectEthereum";

const KEY = "isMetaMask";

export function useHasMetamask() {
  const ethereum = useDetectEthereum();
  const idx = findIndex(
    ethereum?.providers, // window.ethereum will have providers property when multiple evm extensions installed
    KEY,
  );

  return ethereum?.[KEY] || // for only metamask installed
    idx >= 0; // for multiple extensions
}
