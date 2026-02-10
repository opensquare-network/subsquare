import { some } from "lodash-es";
import { useDetectEthereum } from "./useDetectEthereum";

const KEY = "isMetaMask";

export function useHasMetamask() {
  const ethereum = useDetectEthereum();

  if (!ethereum) {
    return false;
  }

  try {
    // for only metamask installed
    if (KEY in ethereum && ethereum?.[KEY]) {
      return true;
    }
  } catch (error) {
    console.error("Failed to access isMetaMask on ethereum object:", error);
  }

  // window.ethereum will have providers property when multiple evm extensions installed
  // for multiple extensions
  try {
    return some(ethereum?.providers, (provider) => {
      try {
        return KEY in provider && provider?.[KEY];
      } catch {
        return false;
      }
    });
  } catch (error) {
    console.error("Failed to access providers array:", error);
    return false;
  }
}
