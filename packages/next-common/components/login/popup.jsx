import { useState } from "react";
import Popup from "../popup/wrapper/Popup";
import LoginPopupEmailContent from "./popupEmailContent";
import LoginPopupForgetContent from "./popupForgetContent";
import LoginPopupWeb3LoginContent from "./popupWeb3LoginContent";
import LoginPopupAccountLoginContent from "./popupAccountLoginContent";
import LoginPopupSignUpContent from "./popupSignUpContent";

/**
 * @param {Parameters<Popup>[0]} props
 */
export default function LoginPopup(props = {}) {
  // web3, account, email, forget, signUp
  const [view, setView] = useState("web3");

  return (
    <Popup wide {...props} className="!p-12">
      {view === "web3" && (
        <LoginPopupWeb3LoginContent onClose={props.onClose} setView={setView} />
      )}

      {view === "account" && (
        <LoginPopupAccountLoginContent
          onClose={props.onClose}
          setView={setView}
        />
      )}

      {view === "email" && (
        <LoginPopupEmailContent onClose={props.onClose} setView={setView} />
      )}

      {view === "forget" && <LoginPopupForgetContent onClose={props.onClose} />}

      {view === "signUp" && (
        <LoginPopupSignUpContent onClose={props.onClose} setView={setView} />
      )}
    </Popup>
  );
}
