import shouldEnableSubstrateWallets from "next-common/utils/shouldEnableSubstrateWallets";
import { createGlobalState } from "react-use";

const VIEWS = {
  SUBSTRATE: "substrate",
  EVM: "evm",
  WALLETCONNECT: "walletconnect",
  POLKADOT_VAULT: "polkadot-vault",
  WATCH_ONLY: "watch-only",
};
const DEFAULT_VIEW = shouldEnableSubstrateWallets()
  ? VIEWS.SUBSTRATE
  : VIEWS.EVM;

const useValueState = createGlobalState(DEFAULT_VIEW);

export function useWeb3WalletView() {
  const [view, setView] = useValueState();

  const isSubstrateView = view === VIEWS.SUBSTRATE;
  const isEVMView = view === VIEWS.EVM;
  const isWalletConnectView = view === VIEWS.WALLETCONNECT;
  const isPolkadotVaultView = view === VIEWS.POLKADOT_VAULT;
  const isWatchOnlyView = view === VIEWS.WATCH_ONLY;

  function resetView() {
    setView(DEFAULT_VIEW);
  }

  return {
    isSubstrateView,
    isEVMView,
    isWalletConnectView,
    isPolkadotVaultView,
    isWatchOnlyView,
    setView,
    resetView,
  };
}
