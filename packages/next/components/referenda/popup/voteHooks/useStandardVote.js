import { useState } from "react";
import { useDispatch } from "react-redux";
import useApi from "next-common/utils/hooks/useApi";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { checkInputValue } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import DirectVote from "../directVote";
import { encodeStandardVoteData } from "next-common/utils/moonPrecompiles/democracy";

export default function useStandardVote({
  module = "convictionVoting",
  referendumIndex,
  isAye,
  addressVoteDelegations,
  isLoading,
  votingBalance,
}) {
  const dispatch = useDispatch();
  const [inputVoteBalance, setInputVoteBalance] = useState("0");
  const [voteLock, setVoteLock] = useState(0);
  const node = useChainSettings();
  const api = useApi();

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const StandardVoteComponent = (
    <DirectVote
      module={module}
      isAye={isAye}
      addressVoteDelegations={addressVoteDelegations}
      isLoading={isLoading}
      inputVoteBalance={inputVoteBalance}
      setInputVoteBalance={setInputVoteBalance}
      voteLock={voteLock}
      setVoteLock={setVoteLock}
    />
  );

  const getStandardVoteTx = () => {
    let bnVoteBalance;
    try {
      bnVoteBalance = checkInputValue(
        inputVoteBalance,
        node.decimals,
        "vote balance",
        true
      );
    } catch (err) {
      showErrorToast(err.message);
      return;
    }

    if (bnVoteBalance.gt(votingBalance)) {
      showErrorToast("Insufficient voting balance");
      return;
    }

    return api.tx[module].vote(referendumIndex, {
      Standard: {
        balance: bnVoteBalance.toString(),
        vote: {
          aye: isAye,
          conviction: voteLock,
        },
      },
    });
  };

  const getMoonStandardVoteTx = () => {
    let bnVoteBalance;
    try {
      bnVoteBalance = checkInputValue(
        inputVoteBalance,
        node.decimals,
        "vote balance",
        true
      );
    } catch (err) {
      showErrorToast(err.message);
      return;
    }

    if (bnVoteBalance.gt(votingBalance)) {
      showErrorToast("Insufficient voting balance");
      return;
    }

    return encodeStandardVoteData({
      refIndex: referendumIndex,
      aye: isAye,
      voteAmount: BigInt(bnVoteBalance.toString()),
      conviction: voteLock,
    });
  };

  return { StandardVoteComponent, getStandardVoteTx, getMoonStandardVoteTx };
}
