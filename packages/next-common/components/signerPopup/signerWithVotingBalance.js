import React from "react";
import Signer from "next-common/components/popup/fields/signerField";
import { useContextApi } from "next-common/context/api";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import { useChainSettings } from "next-common/context/chain";
import { useAddressVotingBalance } from "next-common/utils/hooks/useAddressVotingBalance";

export default function SignerWithVotingBalance({ title, noSwitchSigner }) {
  const { voteSymbol } = useChainSettings();
  const api = useContextApi();
  const signerAccount = useSignerAccount();

  const [balance, loadingBalance] = useAddressVotingBalance(
    api,
    signerAccount?.realAddress,
  );

  return (
    <Signer
      title={title}
      balance={balance}
      symbol={voteSymbol}
      isBalanceLoading={loadingBalance}
      noSwitchSigner={noSwitchSigner}
    />
  );
}
