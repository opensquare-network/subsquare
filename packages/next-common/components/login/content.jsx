import { useEffect } from "react";
import LoginWeb3LoginContent from "./web3LoginContent";
import LoginAccountLoginContent from "./accountLoginContent";
import LoginEVMLoginContent from "./evmLoginContent";
import { useSelector } from "react-redux";
import {
  connectPopupViewSelector,
  setConnectPopupView,
} from "next-common/store/reducers/connectPopupSlice";
import { useDispatch } from "react-redux";
import {
  CONNECT_POPUP_DEFAULT_VIEW,
  CONNECT_POPUP_VIEWS,
} from "next-common/utils/constants";

/**
 * @description used in login popup and login page
 */
export default function LoginContent() {
  const view = useSelector(connectPopupViewSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(setConnectPopupView(CONNECT_POPUP_DEFAULT_VIEW));
    };
  }, []);

  return (
    <>
      {view === CONNECT_POPUP_VIEWS.WEB3 && <LoginWeb3LoginContent />}

      {view === CONNECT_POPUP_VIEWS.EVM && <LoginEVMLoginContent />}

      {view === CONNECT_POPUP_VIEWS.ACCOUNT && <LoginAccountLoginContent />}
    </>
  );
}
