import { noop } from "lodash-es";
import { useWeb3WalletView } from "next-common/hooks/connect/useWeb3WalletView";
import LoginWeb3EVM from "./evm";
import LoginWeb3Substrate from "./substrate";
import { useUnmount } from "react-use";

export default function LoginWeb3({ setIsWeb3 = noop }) {
  const { isSubstrateView, isEVMView, resetView } = useWeb3WalletView();

  useUnmount(resetView);

  return (
    <div className="space-y-6">
      {isSubstrateView && <LoginWeb3Substrate />}

      {isEVMView && <LoginWeb3EVM />}

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
    </div>
  );
}
