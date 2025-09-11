import React, { useCallback, useState } from "react";
import PopupWithSigner from "next-common/components/popupWithSigner";
import PrimaryButton from "next-common/lib/button/primary";
import { PopupButtonWrapper } from "../popup/wrapper";
import { useSignerAccount } from "../popupWithSigner/context";
import SignerWithBalance from "./signerWithBalance";
import { noop } from "lodash-es";

function PopupContent({
  children,
  actionCallback,
  confirmText,
  noSwitchSigner,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const signerAccount = useSignerAccount();

  const onConfirm = useCallback(async () => {
    setIsLoading(true);
    try {
      await actionCallback(signerAccount);
    } finally {
      setIsLoading(false);
    }
  }, [actionCallback, signerAccount]);

  return (
    <>
      <SignerWithBalance noSwitchSigner={noSwitchSigner} />
      {children}
      <PopupButtonWrapper>
        <PrimaryButton loading={isLoading} onClick={onConfirm}>
          {confirmText}
        </PrimaryButton>
      </PopupButtonWrapper>
    </>
  );
}

export default function SignerPopup({
  children,
  actionCallback = noop,
  confirmText = "Confirm",
  noSwitchSigner,
  ...props
}) {
  return (
    <PopupWithSigner {...props}>
      <PopupContent
        noSwitchSigner={noSwitchSigner}
        actionCallback={actionCallback}
        confirmText={confirmText}
      >
        {children}
      </PopupContent>
    </PopupWithSigner>
  );
}
