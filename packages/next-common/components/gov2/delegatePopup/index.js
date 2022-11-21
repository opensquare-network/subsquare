import { useState } from "react";
import { useDispatch } from "react-redux";

import { useAddressVotingBalance } from "utils/hooks";
import useApi from "../../../utils/hooks/useApi";
import useIsMounted from "../../../utils/hooks/useIsMounted";
import { newErrorToast } from "../../../store/reducers/toastSlice";
import { checkInputValue, emptyFunction, isSameAddress } from "../../../utils";
import Signer from "./signer";

import PopupWithAddress from "../../../components/popupWithAddress";
import { sendTx } from "../../../utils/sendTx";
import { useChainSettings } from "../../../context/chain";
import VoteLock from "./voteLock";
import VoteValue from "./voteValue";
import Target from "./target";
import SecondaryButton from "../../buttons/secondaryButton";
import styled from "styled-components";

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

  const [selectedAccount, setSelectedAccount] = useState(null);
  const [targetAddress, setTargetAddress] = useState("");

  const api = useApi();
  const node = useChainSettings();

  const [isLoading, setIsLoading] = useState(false);
  const [votingBalance, votingIsLoading] = useAddressVotingBalance(
    api,
    selectedAccount?.address
  );

  const [inputVoteBalance, setInputVoteBalance] = useState("0");
  const [voteLock, setVoteLock] = useState(0);

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

    if (!selectedAccount) {
      return showErrorToast("Please select an account");
    }

    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    if (!targetAddress) {
      return showErrorToast("Please input a target address");
    }

    const signerAddress = selectedAccount?.address;

    if (isSameAddress(targetAddress, signerAddress)) {
      return showErrorToast(
        "Target address cannot be same with the signer address"
      );
    }

    const tx = api.tx.convictionVoting.delegate(
      trackId,
      targetAddress,
      voteLock,
      bnVoteBalance.toString()
    );

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
        api={api}
        votingIsLoading={votingIsLoading}
        votingBalance={votingBalance}
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
        isLoading={isLoading}
        extensionAccounts={extensionAccounts}
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
      <VoteLock voteLock={voteLock} setVoteLock={setVoteLock} />
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
    <PopupWithAddress title="Delegate" Component={PopupContent} {...props} />
  );
}
