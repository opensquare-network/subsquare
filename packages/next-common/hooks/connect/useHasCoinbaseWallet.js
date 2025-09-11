import { some } from "lodash-es";
import { useDetectEthereum } from "./useDetectEthereum";

const KEY = "isCoinbaseWallet";

export function useHasCoinbaseWallet() {
  const ethereum = useDetectEthereum();

  // for only coinbase wallet installed
  if (ethereum?.[KEY]) {
    return true;
  }

  // window.ethereum will have providers property when multiple evm extensions installed
  // for multiple extensions
  return some(ethereum?.providers, KEY);
}
