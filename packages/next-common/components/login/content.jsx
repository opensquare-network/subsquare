import LoginWeb3LoginContent from "./web3LoginContent";
import LoginAccountLoginContent from "./accountLoginContent";
import LoginEVMContent from "./evm/content";
import { CONNECT_POPUP_VIEWS } from "next-common/utils/constants";
import { useConnectPopupView } from "next-common/hooks/connect/useConnectPopupView";
import { useEffect } from "react";

/**
 * @description used in login popup and login page
 */
export default function LoginContent() {
  const [view, , reset] = useConnectPopupView();

  useEffect(() => {
    return reset;
  }, []);

  return (
    <>
      {view === CONNECT_POPUP_VIEWS.WEB3 && <LoginWeb3LoginContent />}

      {view === CONNECT_POPUP_VIEWS.EVM && <LoginEVMContent />}

      {view === CONNECT_POPUP_VIEWS.ACCOUNT && <LoginAccountLoginContent />}
    </>
  );
}
