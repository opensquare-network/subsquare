import { useState } from "react";
import Popup from "../popup/wrapper/Popup";
import PopupEmailContent from "./popupEmailContent";
import PopupLoginContent from "./popupLoginContent";

/**
 * @param {Parameters<Popup>[0]} props
 */
export default function LoginPopup(props = {}) {
  // login, email, forgetPassword
  const [view, setView] = useState("login");

  return (
    <Popup wide {...props} className="!p-12">
      {view === "login" && (
        <PopupLoginContent onClose={props.onClose} setView={setView} />
      )}

      {view === "email" && (
        <PopupEmailContent onClose={props.onClose} setView={setView} />
      )}

      {view === "forgetPassword" && <div>forget</div>}
    </Popup>
  );
}
