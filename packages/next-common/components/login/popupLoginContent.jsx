import { useState } from "react";
import AddressLogin from "./addressLogin";
import MailLogin from "./mailLogin";

export default function PopupLoginContent({ onClose, setView }) {
  const [addressLogin, setAddressLogin] = useState(true);
  const mailLogin = !addressLogin;

  return (
    <>
      <h3 className="text20Bold text-textPrimary text-center">Login</h3>

      {addressLogin && (
        <AddressLogin
          setMailLogin={() => {
            setAddressLogin(false);
          }}
          onClose={onClose}
          setView={setView}
        />
      )}

      {mailLogin && (
        <MailLogin
          setAddressLogin={() => {
            setAddressLogin(true);
          }}
          onClose={onClose}
          setView={setView}
        />
      )}
    </>
  );
}
