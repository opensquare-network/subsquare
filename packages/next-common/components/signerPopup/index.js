import React from "react";
import useApi from "next-common/utils/hooks/useApi";
import PopupWithAddress from "next-common/components/popupWithAddress";
import PrimaryButton from "next-common/components/buttons/primaryButton";
import useSignerAccount from "next-common/utils/hooks/useSignerAccount";
import Signer from "next-common/components/popup/fields/signerField";
import useAddressBalance from "next-common/utils/hooks/useAddressBalance";
import { emptyFunction } from "../../utils";
import { PopupButtonWrapper } from "../popup/wrapper";

function PopupContent({
  extensionAccounts,
  actionCallback = emptyFunction,
  isLoading = false,
  confirmText = "Confirm",
}) {
  const api = useApi();
  const signerAccount = useSignerAccount(extensionAccounts);
  const [balance, loadingBalance] = useAddressBalance(
    api,
    signerAccount?.realAddress,
  );
  const [signerBalance, isSignerBalanceLoading] = useAddressBalance(
    api,
    signerAccount?.address,
  );

  return (
    <>
      <Signer
        signerAccount={signerAccount}
        balance={balance}
        isBalanceLoading={loadingBalance}
        signerBalance={signerBalance}
        isSignerBalanceLoading={isSignerBalanceLoading}
      />
      <PopupButtonWrapper>
        <PrimaryButton
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
  return <PopupWithAddress title={title} Component={PopupContent} {...props} />;
}
