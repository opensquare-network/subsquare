import isEvmChain, {
  isSupportSubstrateThroughEthereumAddress,
} from "next-common/utils/isEvmChain";
import { createGlobalState } from "react-use";

const VIEWS = {
  SUBSTRATE: "substrate",
  EVM: "evm",
};
const DEFAULT_VIEW =
  isEvmChain() && !isSupportSubstrateThroughEthereumAddress()
    ? VIEWS.EVM
    : VIEWS.SUBSTRATE;

const useValueState = createGlobalState(DEFAULT_VIEW);

export function useWeb3WalletView() {
  const [view, setView] = useValueState();

  const isSubstrateView = view === VIEWS.SUBSTRATE;
  const isEVMView = view === VIEWS.EVM;

  function resetView() {
    setView(DEFAULT_VIEW);
  }

  return {
    isSubstrateView,
    isEVMView,
    setView,
    resetView,
  };
}
