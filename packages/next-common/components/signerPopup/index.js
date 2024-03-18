import React from "react";
import PopupWithSigner from "next-common/components/popupWithSigner";
import PrimaryButton from "next-common/lib/button/primary";
import { emptyFunction } from "../../utils";
import { PopupButtonWrapper } from "../popup/wrapper";
import { useSignerAccount, usePopupParams } from "../popupWithSigner/context";
import SignerWithBalance from "./signerWithBalance";
import { useContextApi } from "next-common/context/api";

function PopupContent({ children }) {
  const {
    actionCallback = emptyFunction,
    isLoading = false,
    confirmText = "Confirm",
    disabled = false,
  } = usePopupParams();
  const api = useContextApi();
  const signerAccount = useSignerAccount();

  return (
    <>
      <SignerWithBalance />
      {children}
      <PopupButtonWrapper>
        <PrimaryButton
          disabled={disabled}
          isLoading={isLoading}
          onClick={() => actionCallback(api, signerAccount)}
        >
          {confirmText}
        </PrimaryButton>
      </PopupButtonWrapper>
    </>
  );
}

export default function SignerPopup({ children, ...props }) {
  return (
    <PopupWithSigner {...props}>
      <PopupContent>{children}</PopupContent>
    </PopupWithSigner>
  );
}
