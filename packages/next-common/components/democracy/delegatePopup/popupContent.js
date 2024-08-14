import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { useAddressVotingBalance } from "utils/hooks";
import { useMountedState } from "react-use";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { checkInputValue, isSameAddress } from "next-common/utils";
import Signer from "next-common/components/popup/fields/signerField";

import { useChainSettings } from "next-common/context/chain";
import Conviction from "./conviction";
import VoteValue from "./voteValue";
import Target from "./target";
import PrimaryButton from "next-common/lib/button/primary";
import { PopupButtonWrapper } from "../../popup/wrapper";
import {
  useExtensionAccounts,
  useSignerAccount,
} from "next-common/components/popupWithSigner/context";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";
import { normalizeAddress } from "next-common/utils/address";
import { noop } from "lodash-es";

export default function PopupContent({ defaultTargetAddress, targetDisabled }) {
  const {
    onClose,
    onInBlock = noop,
    submitExtrinsic = noop,
  } = usePopupParams();
  const dispatch = useDispatch();
  const isMounted = useMountedState();

  const signerAccount = useSignerAccount();
  const extensionAccounts = useExtensionAccounts();

  const [targetAddress, setTargetAddress] = useState(
    normalizeAddress(defaultTargetAddress) || "",
  );

  const api = useContextApi();
  const node = useChainSettings();

  const [isLoading, setIsLoading] = useState(false);
  const [votingBalance, votingIsLoading] = useAddressVotingBalance(
    api,
    signerAccount?.realAddress,
  );

  const [signerBalance, isSignerBalanceLoading] = useAddressVotingBalance(
    api,
    signerAccount?.address,
  );

  const [inputVoteBalance, setInputVoteBalance] = useState("0");
  const [conviction, setConviction] = useState(0);

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const doDelegate = async () => {
    if (isLoading) {
      return;
    }

    let bnVoteBalance;
    try {
      bnVoteBalance = checkInputValue(
        inputVoteBalance,
        node.decimals,
        "vote balance",
      );
    } catch (err) {
      return showErrorToast(err.message);
    }

    if (bnVoteBalance.gt(votingBalance)) {
      return showErrorToast("Insufficient voting balance");
    }

    if (!signerAccount) {
      return showErrorToast("Please select an account");
    }

    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    if (!targetAddress) {
      return showErrorToast("Please input a target address");
    }

    if (isSameAddress(targetAddress, signerAccount?.realAddress)) {
      return showErrorToast(
        "Target address cannot be same with the delegator address",
      );
    }

    await submitExtrinsic({
      api,
      conviction,
      bnVoteBalance,
      targetAddress,
      dispatch,
      setLoading: setIsLoading,
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
        balance={votingBalance}
        isBalanceLoading={votingIsLoading}
        signerBalance={signerBalance}
        isSignerBalanceLoading={isSignerBalanceLoading}
        symbol={node.voteSymbol || node.symbol}
      />
      <Target
        disabled={targetDisabled}
        extensionAccounts={extensionAccounts}
        defaultAddress={targetAddress}
        setAddress={setTargetAddress}
      />
      <VoteValue
        isLoading={isLoading}
        inputVoteBalance={inputVoteBalance}
        setInputVoteBalance={setInputVoteBalance}
        node={node}
      />
      <Conviction
        balance={inputVoteBalance}
        conviction={conviction}
        setConviction={setConviction}
      />
      <PopupButtonWrapper>
        <PrimaryButton loading={isLoading} onClick={doDelegate}>
          Confirm
        </PrimaryButton>
      </PopupButtonWrapper>
    </>
  );
}
