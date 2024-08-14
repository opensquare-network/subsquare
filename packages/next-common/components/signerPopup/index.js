import React from "react";
import PopupWithSigner from "next-common/components/popupWithSigner";
import PrimaryButton from "next-common/lib/button/primary";
import { PopupButtonWrapper } from "../popup/wrapper";
import { useSignerAccount, usePopupParams } from "../popupWithSigner/context";
import SignerWithBalance from "./signerWithBalance";
import { useContextApi } from "next-common/context/api";
import { noop } from "lodash-es";

function PopupContent({ children }) {
  const {
    actionCallback = noop,
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
          loading={isLoading}
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
