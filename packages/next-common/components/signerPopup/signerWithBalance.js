import React from "react";
import Signer from "next-common/components/popup/fields/signerField";
import useAddressBalance from "next-common/utils/hooks/useAddressBalance";
import { useSignerAccount } from "../popupWithSigner/context";
import { useContextApi } from "next-common/context/api";

export default function SignerWithBalance({ title }) {
  const api = useContextApi();
  const signerAccount = useSignerAccount();

  const [balance, loadingBalance] = useAddressBalance(
    api,
    signerAccount?.realAddress,
  );

  const [signerBalance, isSignerBalanceLoading] = useAddressBalance(
    api,
    signerAccount?.address,
  );

  return (
    <Signer
      title={title}
      balance={balance}
      isBalanceLoading={loadingBalance}
      signerBalance={signerBalance}
      isSignerBalanceLoading={isSignerBalanceLoading}
    />
  );
}
