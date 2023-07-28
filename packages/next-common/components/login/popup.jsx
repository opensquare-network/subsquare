import { useEffect, useState } from "react";
import Popup from "../popup/wrapper/Popup";
import LoginPopupEmailContent from "./popupEmailContent";
import LoginPopupForgetContent from "./popupForgetContent";
import LoginPopupWeb3LoginContent from "./popupWeb3LoginContent";
import LoginPopupAccountLoginContent from "./popupAccountLoginContent";
import LoginPopupSignUpContent from "./popupSignUpContent";
import { useLoginPopup } from "next-common/hooks/useLoginPopup";

/**
 * @param {Parameters<Popup>[0]} props
 */
export default function LoginPopup(props = {}) {
  // web3, account, email, forget, signUp
  const [view, setView] = useState("web3");
  const { loginPopupOpen, closeLoginPopup } = useLoginPopup();

  useEffect(() => {
    // reset to web3
    if (!loginPopupOpen) {
      setView("web3");
    }
  }, [loginPopupOpen]);

  return (
    loginPopupOpen && (
      <Popup wide {...props} className="!p-12" onClose={closeLoginPopup}>
        {view === "web3" && <LoginPopupWeb3LoginContent setView={setView} />}

        {view === "account" && (
          <LoginPopupAccountLoginContent setView={setView} />
        )}

        {view === "email" && <LoginPopupEmailContent setView={setView} />}

        {view === "forget" && <LoginPopupForgetContent />}

        {view === "signUp" && <LoginPopupSignUpContent setView={setView} />}
      </Popup>
    )
  );
}
