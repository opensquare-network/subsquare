import React from "react";
import PopupWithSigner from "next-common/components/popupWithSigner";
import PrimaryButton from "next-common/components/buttons/primaryButton";
import { emptyFunction } from "../../utils";
import { PopupButtonWrapper } from "../popup/wrapper";
import { useSignerAccount } from "../popupWithSigner/context";
import SignerWithBalance from "./signerWithBalance";
import { useContextApi } from "next-common/context/api";

function PopupContent({
  actionCallback = emptyFunction,
  isLoading = false,
  confirmText = "Confirm",
  disabled = false,
  children,
}) {
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

export default function SignerPopup({ title, ...props }) {
  return <PopupWithSigner title={title} Component={PopupContent} {...props} />;
}
