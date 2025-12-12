import { noop } from "lodash-es";
import { useWeb3WalletView } from "next-common/hooks/connect/useWeb3WalletView";
import LoginWeb3EVM from "./evm";
import LoginWeb3Substrate from "./substrate";
import { useUnmount } from "react-use";
import LoginWeb3WalletConnect from "./walletconnect";
import LoginWeb3PolkadotVault from "./polkadotVault";
import { useChainSettings } from "next-common/context/chain";

export default function LoginWeb3({ setIsWeb3 = noop }) {
  const chainSettings = useChainSettings();
  const {
    isSubstrateView,
    isEVMView,
    isWalletConnectView,
    isPolkadotVaultView,
    resetView,
  } = useWeb3WalletView();

  useUnmount(resetView);

  return (
    <div className="space-y-6">
      {isSubstrateView && <LoginWeb3Substrate />}

      {isEVMView && <LoginWeb3EVM />}

      {isWalletConnectView && <LoginWeb3WalletConnect />}
      {isPolkadotVaultView && <LoginWeb3PolkadotVault />}

      {chainSettings?.allowWeb2Login && (
        <div className="text-center text14Medium text-textSecondary">
          Login with{" "}
          <span
            className="text-theme500"
            role="button"
            onClick={() => {
              setIsWeb3(false);
            }}
          >
            Account
          </span>
        </div>
      )}
    </div>
  );
}
