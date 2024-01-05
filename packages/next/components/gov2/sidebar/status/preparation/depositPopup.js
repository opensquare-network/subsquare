import { useDispatch } from "react-redux";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import useApi from "next-common/utils/hooks/useApi";
import PopupWithSigner from "next-common/components/popupWithSigner";
import { usePostOnChainData } from "next-common/context/post";
import { useChainSettings } from "next-common/context/chain";
import BalanceInput from "next-common/components/balanceInput";
import { toPrecision } from "next-common/utils";
import React, { useState } from "react";
import PopupLabel from "next-common/components/popup/label";
import Input from "next-common/components/input";
import { PopupButtonWrapper } from "next-common/components/popup/wrapper";
import PrimaryButton from "next-common/components/buttons/primaryButton";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";

function PopupContent() {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const api = useApi();
  const node = useChainSettings();

  const { referendumIndex, trackInfo: track } = usePostOnChainData();
  const signerAccount = useSignerAccount();

  const [calling, setCalling] = useState(false);

  const showErrorToast = (message) => dispatch(newErrorToast(message));
  const doDeposit = async () => {
    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    let tx = api.tx.referenda.placeDecisionDeposit(referendumIndex);
    if (signerAccount?.proxyAddress) {
      tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
    }

    await sendTx({
      tx,
      dispatch,
      setLoading: setCalling,
      signerAddress: signerAccount.address,
      isMounted,
    });
  };

  return (
    <>
      <SignerWithBalance />
      <div>
        <PopupLabel text={"Referendum ID"} />
        <Input value={referendumIndex} disabled={true} />
      </div>
      <div>
        <PopupLabel text={"Decision Deposit"} />
        <BalanceInput
          disabled={true}
          value={toPrecision(track.decisionDeposit, node.decimals)}
          symbol={node?.symbol}
        />
      </div>

      <PopupButtonWrapper>
        <PrimaryButton isLoading={calling} onClick={doDeposit}>
          Deposit
        </PrimaryButton>
      </PopupButtonWrapper>
    </>
  );
}

export default function DepositPopup(props) {
  return (
    <PopupWithSigner
      title="Place decision deposit"
      Component={PopupContent}
      {...props}
    />
  );
}
