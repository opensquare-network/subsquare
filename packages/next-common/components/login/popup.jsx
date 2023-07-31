import { useEffect, useState } from "react";
import Popup from "../popup/wrapper/Popup";
import LoginEmailContent from "./emailContent";
import LoginWeb3LoginContent from "./web3LoginContent";
import LoginAccountLoginContent from "./accountLoginContent";
import { useLoginPopup } from "next-common/hooks/useLoginPopup";

/**
 * @param {Parameters<Popup>[0]} props
 */
export default function LoginPopup(props = {}) {
  // web3, account, email
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
      <Popup
        wide
        {...props}
        className="!p-12 max-sm:!p-6"
        onClose={closeLoginPopup}
      >
        {view === "web3" && <LoginWeb3LoginContent setView={setView} />}

        {view === "account" && <LoginAccountLoginContent setView={setView} />}

        {/* aka remind email */}
        {view === "email" && <LoginEmailContent setView={setView} />}
      </Popup>
    )
  );
}
