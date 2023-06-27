import { useDispatch } from "react-redux";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import useApi from "next-common/utils/hooks/useApi";
import useSignerAccount from "next-common/utils/hooks/useSignerAccount";
import Signer from "next-common/components/popup/fields/signerField";
import useAddressBalance from "next-common/utils/hooks/useAddressBalance";
import PopupWithAddress from "next-common/components/popupWithAddress";
import { usePostOnChainData } from "next-common/context/post";
import { useChainSettings } from "next-common/context/chain";
import BalanceInput from "next-common/components/balanceInput";
import { emptyFunction, toPrecision } from "next-common/utils";
import React, { useState } from "react";
import PopupLabel from "next-common/components/popup/label";
import Input from "next-common/components/input";
import { PopupButtonWrapper } from "next-common/components/popup/wrapper";
import SecondaryButton from "next-common/components/buttons/secondaryButton";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";

function PopupContent({
  extensionAccounts,
  onClose = emptyFunction,
  onSubmitted = emptyFunction,
  onInBlock = emptyFunction,
}) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const api = useApi();
  const node = useChainSettings();

  const { referendumIndex, trackInfo: track } = usePostOnChainData();
  const signerAccount = useSignerAccount(extensionAccounts);
  const [balance, loadingBalance] = useAddressBalance(api, signerAccount?.realAddress);
  const [signerBalance, isSignerBalanceLoading] = useAddressBalance(api, signerAccount?.address);

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
      onInBlock,
      onSubmitted,
      onClose,
      signerAddress: signerAccount.address,
      isMounted,
    });
  };

  return (
    <>
      <Signer
        signerAccount={signerAccount}
        balance={balance}
        isBalanceLoading={loadingBalance}
        signerBalance={signerBalance}
        isSignerBalanceLoading={isSignerBalanceLoading}
      />
      <div>
        <PopupLabel text={"Referendum ID"} />
        <Input
          value={referendumIndex}
          disabled={true}
        />
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
        <SecondaryButton isLoading={calling} onClick={doDeposit}>
          Deposit
        </SecondaryButton>
      </PopupButtonWrapper>
    </>
  );
}

export default function DepositPopup(props) {
  return <PopupWithAddress title="Place decision deposit" Component={PopupContent} {...props} />;
}
