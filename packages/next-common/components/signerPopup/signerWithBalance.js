import React from "react";
import Signer from "next-common/components/popup/fields/signerField";
import { useSignerAccount } from "../popupWithSigner/context";
import { useSubBalanceInfo } from "next-common/hooks/balance/useSubBalanceInfo";

export default function SignerWithBalance({
  title,
  noSwitchSigner,
  showTransferable = false,
  supportedMultisig = true,
  api = null,
}) {
  const signerAccount = useSignerAccount();

  const { value, loading: loadingBalance } = useSubBalanceInfo(
    signerAccount?.realAddress,
    api,
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
      supportedMultisig={supportedMultisig}
    />
  );
}
