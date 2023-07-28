import { useState } from "react";
import Popup from "../popup/wrapper/Popup";
import LoginPopupEmailContent from "./popupEmailContent";
import LoginPopupForgetContent from "./popupForgetContent";
import LoginPopupWeb3LoginContent from "./popupWeb3LoginContent";
import LoginPopupAccountLoginContent from "./popupAccountLoginContent";

/**
 * @param {Parameters<Popup>[0]} props
 */
export default function LoginPopup(props = {}) {
  // web3, account, email, forget
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
    </Popup>
  );
}
