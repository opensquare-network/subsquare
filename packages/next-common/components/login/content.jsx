import { useEffect } from "react";
import LoginWeb3LoginContent from "./web3LoginContent";
import LoginAccountLoginContent from "./accountLoginContent";
import LoginWeb3EVMLoginContent from "./web3EVMLoginContent";
import { useSelector } from "react-redux";
import {
  connectPopupViewSelector,
  setConnectPopupView,
} from "next-common/store/reducers/connectPopupSlice";
import { useDispatch } from "react-redux";
import isEvmChain from "next-common/utils/isEvmChain";

/**
 * @description used in login popup and login page
 */
export default function LoginContent() {
  const view = useSelector(connectPopupViewSelector);
  const dispatch = useDispatch();
  const defaultView = isEvmChain() ? "web3evm" : "web3";

  useEffect(() => {
    return () => {
      dispatch(setConnectPopupView(defaultView));
    };
  }, []);

  return (
    <>
      {view === "web3" && <LoginWeb3LoginContent />}

      {view === "web3evm" && <LoginWeb3EVMLoginContent />}

      {view === "account" && <LoginAccountLoginContent />}
    </>
  );
}
