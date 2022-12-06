import { useState } from "react";
import { useDispatch } from "react-redux";

import { useAddressVotingBalance } from "utils/hooks";
import useApi from "next-common/utils/hooks/useApi";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import {
  checkInputValue,
  emptyFunction,
  isSameAddress,
} from "next-common/utils";
import Signer from "next-common/components/popup/fields/signerField";

import PopupWithAddress from "next-common/components/popupWithAddress";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import { useChainSettings } from "next-common/context/chain";
import Conviction from "next-common/components/democracy/delegatePopup/conviction";
import VoteValue from "next-common/components/democracy/delegatePopup/voteValue";
import Target from "next-common/components/democracy/delegatePopup/target";
import SecondaryButton from "next-common/components/buttons/secondaryButton";
import styled from "styled-components";
import useSignerAccount from "next-common/utils/hooks/useSignerAccount";

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

function PopupContent({
  extensionAccounts,
  trackId,
  onClose,
  onInBlock = emptyFunction,
}) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();

  const signerAccount = useSignerAccount(extensionAccounts);

  const [targetAddress, setTargetAddress] = useState("");

  const api = useApi();
  const node = useChainSettings();

  const [isLoading, setIsLoading] = useState(false);
  const [votingBalance, votingIsLoading] = useAddressVotingBalance(
    api,
    signerAccount?.realAddress
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
        "vote balance"
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

    const signerAddress = signerAccount?.address;

    if (isSameAddress(targetAddress, signerAddress)) {
      return showErrorToast(
        "Target address cannot be same with the signer address"
      );
    }

    let tx = api.tx.convictionVoting.delegate(
      trackId,
      targetAddress,
      conviction,
      bnVoteBalance.toString()
    );

    if (signerAccount?.proxyAddress) {
      tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
    }

    setIsLoading(true);
    await sendTx({
      tx,
      dispatch,
      setLoading: setIsLoading,
      onInBlock,
      onClose,
      signerAddress,
      isMounted,
    });
  };

  return (
    <>
      <Signer
        isBalanceLoading={votingIsLoading}
        balance={votingBalance}
        balanceName="Voting balance"
        signerAccount={signerAccount}
      />
      <Target
        extensionAccounts={extensionAccounts}
        setAddress={setTargetAddress}
      />
      <VoteValue
        isLoading={isLoading}
        inputVoteBalance={inputVoteBalance}
        setInputVoteBalance={setInputVoteBalance}
        node={node}
      />
      <Conviction conviction={conviction} setConviction={setConviction} />
      <ButtonWrapper>
        <SecondaryButton isLoading={isLoading} onClick={doDelegate}>
          Confirm
        </SecondaryButton>
      </ButtonWrapper>
    </>
  );
}

export default function DelegatePopup(props) {
  return (
    <PopupWithAddress
      title="Delegate"
      Component={PopupContent}
      autoCloseAfterLogin={true}
      {...props}
    />
  );
}
