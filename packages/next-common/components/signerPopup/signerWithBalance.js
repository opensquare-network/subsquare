import React from "react";
import useApi from "next-common/utils/hooks/useApi";
import Signer from "next-common/components/popup/fields/signerField";
import useAddressBalance from "next-common/utils/hooks/useAddressBalance";
import { useSignerAccount } from "../popupWithSigner/context";

export default function SignerWithBalance() {
  const api = useApi();
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
      balance={balance}
      isBalanceLoading={loadingBalance}
      signerBalance={signerBalance}
      isSignerBalanceLoading={isSignerBalanceLoading}
    />
  );
}
