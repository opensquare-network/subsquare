import React from "react";
import { useUser } from "../../context/user/index.js";
import { isSameAddress } from "../../utils/index.js";
import LoginPopup from "../login/popup.jsx";

export default function MaybeLogin({ children, accounts, onClose }) {
  const loginUser = useUser();

  if (
    !loginUser?.address ||
    !accounts?.find((acc) => isSameAddress(acc.address, loginUser.address))
  ) {
    return <LoginPopup onClose={onClose} />;
  }

  return children;
}
