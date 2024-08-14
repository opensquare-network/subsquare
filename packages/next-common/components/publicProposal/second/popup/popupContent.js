import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Signer from "next-common/components/popup/fields/signerField";
import { useMountedState } from "react-use";
import { newErrorToast } from "../../../../store/reducers/toastSlice";
import DepositRequired from "./depositRequired";
import SubmitButton from "./submitButton";
import useDeposit from "./useDeposit";
import { isNil, noop } from "lodash-es";
import SecondPopupInputTimes from "./inputTimes";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import useIsLoaded from "next-common/hooks/useIsLoaded";
import { useChainSettings } from "next-common/context/chain";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";

export default function PopupContent() {
  const {
    proposalIndex,
    depositorUpperBound,
    depositRequired,
    onClose,
    onInBlock = noop,
    useAddressVotingBalance,
    submitExtrinsic = noop,
  } = usePopupParams();
  const dispatch = useDispatch();
  const isMounted = useMountedState();
  const signerAccount = useSignerAccount();
  const node = useChainSettings();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const api = useContextApi();
  const [balance, loadingBalance] = useAddressVotingBalance(
    api,
    signerAccount?.realAddress,
  );
  const isBalanceLoaded = useIsLoaded(loadingBalance);
  const [signerBalance, isSignerBalanceLoading] = useAddressVotingBalance(
    api,
    signerAccount?.address,
  );
  const {
    deposit,
    balanceInsufficient,
    isLoading: isCheckingDeposit,
  } = useDeposit(depositRequired, balance, isBalanceLoaded);
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

    await submitExtrinsic({
      api,
      proposalIndex,
      depositorUpperBound,
      times,
      dispatch,
      setLoading: setIsSubmitting,
      onInBlock,
      onClose,
      signerAccount,
      isMounted,
    });
  };

  return (
    <>
      <Signer
        balanceName="Voting balance"
        balance={balance}
        isBalanceLoading={loadingBalance}
        signerBalance={signerBalance}
        isSignerBalanceLoading={isSignerBalanceLoading}
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
      <SubmitButton
        onClick={submit}
        balanceInsufficient={balanceInsufficient}
        isSubmitting={isSubmitting}
        disabled={isCheckingDeposit || submitDisabled}
      />
    </>
  );
}
