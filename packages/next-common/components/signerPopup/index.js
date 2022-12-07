import React from "react";
import styled from "styled-components";
import useApi from "next-common/utils/hooks/useApi";
import PopupWithAddress from "next-common/components/popupWithAddress";
import SecondaryButton from "next-common/components/buttons/secondaryButton";
import useSignerAccount from "next-common/utils/hooks/useSignerAccount";
import Signer from "next-common/components/popup/fields/signerField";
import useAddressBalance from "next-common/utils/hooks/useAddressBalance";
import { emptyFunction } from "../../utils";

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

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
    signerAccount?.realAddress
  );
  const [signerBalance, isSignerBalanceLoading] = useAddressBalance(
    api,
    signerAccount?.address
  );

  return (
    <>
      <Signer
        signerAccount={signerAccount}
        isBalanceLoading={loadingBalance}
        balance={balance}
        signerBalance={signerBalance}
        isSignerBalanceLoading={isSignerBalanceLoading}
      />
      <ButtonWrapper>
        <SecondaryButton
          isLoading={isLoading}
          onClick={() => actionCallback(api, signerAccount)}
        >
          {confirmText}
        </SecondaryButton>
      </ButtonWrapper>
    </>
  );
}

export default function SignerPopup({ title, ...props }) {
  return <PopupWithAddress title={title} Component={PopupContent} {...props} />;
}
