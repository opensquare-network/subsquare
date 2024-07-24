import { useIsMobileDevice } from "../useIsMobileDevice";
import { useHasMetamask } from "./useHasMetamask";

export function usePolkagateSnapEnabled() {
  const hasMetaMask = useHasMetamask();
  const isMobile = useIsMobileDevice();

  return hasMetaMask && !isMobile;
}
