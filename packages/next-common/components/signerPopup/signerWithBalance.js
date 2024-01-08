import React from "react";
import useApi from "next-common/utils/hooks/useApi";
import Signer from "next-common/components/popup/fields/signerField";
import useAddressBalance from "next-common/utils/hooks/useAddressBalance";
import {
  useSignerAddress,
  useSignerRealAddress,
} from "../popupWithSigner/context";

export default function SignerWithBalance() {
  const api = useApi();

  const realAddress = useSignerRealAddress();
  const [balance, loadingBalance] = useAddressBalance(api, realAddress);

  const signerAddress = useSignerAddress();
  const [signerBalance, isSignerBalanceLoading] = useAddressBalance(
    api,
    signerAddress,
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
