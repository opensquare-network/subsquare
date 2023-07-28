import { useState } from "react";
import Popup from "../popup/wrapper/Popup";
import LoginPopupEmailContent from "./popupEmailContent";
import LoginPopupLoginContent from "./popupLoginContent";
import LoginPopupForgetContent from "./popupForgetContent";

/**
 * @param {Parameters<Popup>[0]} props
 */
export default function LoginPopup(props = {}) {
  // login, email, forget
  const [view, setView] = useState("login");

  return (
    <Popup wide {...props} className="!p-12">
      {view === "login" && (
        <LoginPopupLoginContent onClose={props.onClose} setView={setView} />
      )}

      {view === "email" && (
        <LoginPopupEmailContent onClose={props.onClose} setView={setView} />
      )}

      {view === "forget" && <LoginPopupForgetContent onClose={props.onClose} />}
    </Popup>
  );
}
