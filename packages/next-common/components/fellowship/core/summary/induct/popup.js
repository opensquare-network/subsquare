import React, { useMemo } from "react";
import useAddressInput from "next-common/components/fellowship/core/summary/induct/useAddressInput";
import PopupWithSigner from "next-common/components/popupWithSigner";
import Signer from "next-common/components/popup/fields/signerField";
import { useChainSettings } from "next-common/context/chain";
import useApi from "next-common/utils/hooks/useApi";
import useAddressBalance from "next-common/utils/hooks/useAddressBalance";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";

function Content({ onClose }) {
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

  const { address: whoAddress, component: whoInput } = useAddressInput("Who");

  // todo: 1. pass error check
  // todo: 2. refresh fellowship core members when in block
  const tx = useMemo(() => {
    if (api && whoAddress) {
      return api.tx.fellowshipCore.induct(whoAddress);
    }
  }, [api, whoAddress]);

  return (
    <>
      <Signer
        balanceName="Balance"
        balance={balance}
        isBalanceLoading={isBalanceLoading}
        signerBalance={signerBalance}
        isSignerBalanceLoading={isSignerBalanceLoading}
        symbol={node.symbol}
      />
      {whoInput}
      <TxSubmissionButton tx={tx} onClose={onClose} />
    </>
  );
}

export default function FellowshipCoreInductionPopup(props) {
  return <PopupWithSigner title="Induct" Component={Content} {...props} />;
}
