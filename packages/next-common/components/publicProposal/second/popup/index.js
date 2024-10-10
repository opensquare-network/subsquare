import React, { useState } from "react";
import PopupWithSigner from "../../../popupWithSigner";
import { useDispatch } from "react-redux";
import Signer from "next-common/components/popup/fields/signerField";
import { newErrorToast } from "../../../../store/reducers/toastSlice";
import DepositRequired from "./depositRequired";
import useDeposit from "./useDeposit";
import { isNil, noop } from "lodash-es";
import SecondPopupInputTimes from "./inputTimes";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import useIsLoaded from "next-common/hooks/useIsLoaded";
import { useChainSettings } from "next-common/context/chain";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";

function PopupContent() {
  const {
    proposalIndex,
    depositorUpperBound,
    depositRequired,
    onInBlock = noop,
    useAddressVotingBalance,
  } = usePopupParams();
  const dispatch = useDispatch();
  const signerAccount = useSignerAccount();
  const node = useChainSettings();

  const [submitDisabled, setSubmitDisabled] = useState(false);
  const api = useContextApi();
  const [balance, loadingBalance] = useAddressVotingBalance(
    api,
    signerAccount?.realAddress,
  );
  const isBalanceLoaded = useIsLoaded(loadingBalance);
  const {
    deposit,
    balanceInsufficient,
    isLoading: isCheckingDeposit,
  } = useDeposit(depositRequired, balance, isBalanceLoaded);
  const [times, setTimes] = useState(1);

  const getTxFunc = async () => {
    if (isNil(proposalIndex)) {
      return;
    }

    let tx = null;
    try {
      if (api.tx.democracy?.second?.meta.args.length < 2) {
        tx = api.tx.democracy.second(proposalIndex);
      } else {
        tx = api.tx.democracy.second(proposalIndex, depositorUpperBound || 1);
      }
    } catch (e) {
      return dispatch(newErrorToast(e.message));
    }

    if (times > 1) {
      const txs = Array.from({ length: times }).fill(tx);
      tx = api.tx.utility.batch(txs);
    }

    return tx;
  };

  return (
    <>
      <Signer
        balanceName="Voting balance"
        balance={balance}
        isBalanceLoading={loadingBalance}
        symbol={node.voteSymbol}
      />
      <DepositRequired
        deposit={deposit}
        balanceInsufficient={balanceInsufficient}
      />
      <SecondPopupInputTimes
        times={times}
        setTimes={setTimes}
        currentTimes={depositorUpperBound}
        setSubmitDisabled={setSubmitDisabled}
      />
      <TxSubmissionButton
        getTxFunc={getTxFunc}
        disabled={balanceInsufficient || isCheckingDeposit || submitDisabled}
        onInBlock={onInBlock}
      />
    </>
  );
}

export default function Popup(props) {
  return (
    <PopupWithSigner title="Second" {...props}>
      <PopupContent />
    </PopupWithSigner>
  );
}
