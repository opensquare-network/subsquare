import { CONNECT_POPUP_VIEWS } from "next-common/utils/constants";
import { useConnectPopupView } from "next-common/hooks/connect/useConnectPopupView";
import { useEffect } from "react";
import LoginRegisterContent from "./registerContent";
import AddressLogin from "./addressLogin";
import isMixedChain from "next-common/utils/isMixedChain";
import BackToSubstrateWalletOption from "../wallet/backToSubstrateWalletOption";
import LoginEVMForm from "./evm/form";
import MailLogin from "./mailLogin";

function Title({ isWeb2 = true }) {
  return (
    <h3 className="text20Bold text-textPrimary">
      <span>{isWeb2 ? "Login" : "Connect"} with </span>
      <span className="text-theme500">{isWeb2 ? "Account" : "Address"}</span>
    </h3>
  );
}

/**
 * @description used in login popup and login page
 */
export default function LoginContent({ showRegister = true } = {}) {
  const [view, , reset] = useConnectPopupView();
  const evmShowBack = isMixedChain();

  const isWeb3View = view === CONNECT_POPUP_VIEWS.SUBSTRATE;
  const isEVMView = view === CONNECT_POPUP_VIEWS.EVM;
  const isAccountView = view === CONNECT_POPUP_VIEWS.ACCOUNT;

  useEffect(() => {
    return reset;
  }, []);

  return (
    <div className="space-y-6">
      <Title isWeb2={isAccountView} />

      {isWeb3View && <AddressLogin />}

      {isEVMView && (
        <>
          {evmShowBack && (
            <div className="grid grid-cols-2 gap-2 max-sm:grid-cols-1">
              <BackToSubstrateWalletOption />
            </div>
          )}

          <LoginEVMForm />
        </>
      )}

      {isAccountView && <MailLogin />}

      {showRegister && <LoginRegisterContent />}
    </div>
  );
}
