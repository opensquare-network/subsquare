import React from "react";
import Signer from "next-common/components/popup/fields/signerField";
import { useSignerAccount } from "../popupWithSigner/context";
import { useSubBalanceInfo } from "next-common/hooks/balance/useSubBalanceInfo";

export default function SignerWithBalance({
  title,
  noSwitchSigner,
  showTransferable = false,
}) {
  const signerAccount = useSignerAccount();

  const { value, loading: loadingBalance } = useSubBalanceInfo(
    signerAccount?.realAddress,
  );

  const { balance, transferrable } = value || {};

  const displayBalance = showTransferable ? transferrable : balance;

  return (
    <Signer
      title={title}
      balance={displayBalance}
      isBalanceLoading={loadingBalance}
      noSwitchSigner={noSwitchSigner}
      showTransferable={showTransferable}
    />
  );
}
