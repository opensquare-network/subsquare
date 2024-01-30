import React, { useState } from "react";
import useAddressInput from "next-common/components/fellowship/core/summary/induct/useAddressInput";
import PopupWithSigner from "next-common/components/popupWithSigner";
import Signer from "next-common/components/popup/fields/signerField";
import { useChainSettings } from "next-common/context/chain";
import useApi from "next-common/utils/hooks/useApi";
import useAddressBalance from "next-common/utils/hooks/useAddressBalance";
import { useDispatch } from "react-redux";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import { PopupButtonWrapper } from "next-common/components/popup/wrapper";
import PrimaryButton from "next-common/components/buttons/primaryButton";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import useIsMounted from "next-common/utils/hooks/useIsMounted";

function Content({ onClose }) {
  const node = useChainSettings();
  const dispatch = useDispatch();
  const signerAccount = useSignerAccount();
  const [isCalling, setIsCalling] = useState(false);
  const isMounted = useIsMounted();
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

  const onConfirm = async () => {
    if (!api) {
      dispatch(newErrorToast("Chain network is not connected yet"));
      return;
    }

    let tx = api.tx.fellowshipCore.induct(whoAddress);
    if (signerAccount?.proxyAddress) {
      tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
    }

    await sendTx({
      tx,
      dispatch,
      setLoading: setIsCalling,
      signerAddress: signerAccount.address,
      isMounted,
      onClose,
    });
  };

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
      <PopupButtonWrapper>
        <PrimaryButton isLoading={isCalling} onClick={onConfirm}>
          Confirm
        </PrimaryButton>
      </PopupButtonWrapper>
    </>
  );
}

export default function FellowshipCoreInductionPopup(props) {
  return <PopupWithSigner title="Induct" Component={Content} {...props} />;
}
