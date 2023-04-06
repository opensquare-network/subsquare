import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Signer from "next-common/components/popup/fields/signerField";

import useApi from "../../../../utils/hooks/useApi";
import useIsMounted from "../../../../utils/hooks/useIsMounted";
import { newErrorToast } from "../../../../store/reducers/toastSlice";
import PopupWithAddress from "../../../popupWithAddress";
import DepositRequired from "./depositRequired";
import SubmitButton from "./submitButton";
import { sendTx, wrapWithProxy } from "../../../../utils/sendTx";
import { emptyFunction } from "../../../../utils";
import useDeposit from "./useDeposit";
import isNil from "lodash.isnil";
import useSignerAccount from "../../../../utils/hooks/useSignerAccount";
import SecondPopupInputTimes from "./inputTimes";

function PopupContent({
  extensionAccounts,
  proposalIndex,
  depositorUpperBound,
  depositRequired,
  onClose,
  onSubmitted = emptyFunction,
  onFinalized = emptyFunction,
  onInBlock = emptyFunction,
  useAddressVotingBalance,
}) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const signerAccount = useSignerAccount(extensionAccounts);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const api = useApi();
  const [balance, loadingBalance] = useAddressVotingBalance(
    api,
    signerAccount?.realAddress,
  );
  const [signerBalance, isSignerBalanceLoading] = useAddressVotingBalance(
    api,
    signerAccount?.address,
  );
  const { deposit, balanceInsufficient } = useDeposit(depositRequired, balance);
  const [times, setTimes] = useState(1);

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const submit = async () => {
    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    if (isNil(proposalIndex)) {
      return;
    }

    if (!signerAccount) {
      return showErrorToast("Please select an account");
    }

    let tx = null;
    try {
      if (api.tx.democracy?.second?.meta.args.length < 2) {
        tx = api.tx.democracy.second(proposalIndex);
      } else {
        tx = api.tx.democracy.second(proposalIndex, depositorUpperBound || 1);
      }
    } catch (e) {
      return showErrorToast(e.message);
    }

    if (times > 1) {
      const txs = Array.from({ length: times }).fill(tx);
      tx = api.tx.utility.batch(txs);
    }

    if (signerAccount?.proxyAddress) {
      tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
    }

    const signerAddress = signerAccount.address;

    await sendTx({
      tx,
      dispatch,
      setLoading: setIsSubmitting,
      onFinalized,
      onInBlock,
      onSubmitted,
      onClose,
      signerAddress,
      isMounted,
    });
  };

  return (
    <>
      <Signer
        signerAccount={signerAccount}
        balanceName="Voting balance"
        balance={balance}
        isBalanceLoading={loadingBalance}
        signerBalance={signerBalance}
        isSignerBalanceLoading={isSignerBalanceLoading}
      />
      <DepositRequired
        deposit={deposit}
        balanceInsufficient={balanceInsufficient}
      />
      <SecondPopupInputTimes
        times={times}
        setTimes={setTimes}
        setSubmitDisabled={setSubmitDisabled}
      />
      <SubmitButton
        onClick={submit}
        balanceInsufficient={balanceInsufficient}
        isSubmitting={isSubmitting}
        disabled={submitDisabled}
      />
    </>
  );
}

export default function Popup(props) {
  return (
    <PopupWithAddress title="Second" Component={PopupContent} {...props} />
  );
}
