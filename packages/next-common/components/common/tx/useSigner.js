import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import useApi from "next-common/utils/hooks/useApi";
import useAddressBalance from "next-common/utils/hooks/useAddressBalance";
import Signer from "next-common/components/popup/fields/signerField";
import React from "react";
import { useChainSettings } from "next-common/context/chain";

export default function useSigner(title) {
  const node = useChainSettings();
  const signerAccount = useSignerAccount();
  const api = useApi();
  const [balance, isBalanceLoading] = useAddressBalance(
    api,
    signerAccount?.realAddress,
  );
  const [signerBalance, isSignerBalanceLoading] = useAddressBalance(
    api,
    signerAccount?.address,
  );

  const component = (
    <Signer
      balanceName="Balance"
      balance={balance}
      isBalanceLoading={isBalanceLoading}
      signerBalance={signerBalance}
      isSignerBalanceLoading={isSignerBalanceLoading}
      symbol={node.symbol}
      title={title}
    />
  );

  return {
    signerAccount,
    balance,
    signerBalance,
    component,
  };
}
