import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { checkInputValue } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import DirectVote from "../directVote";
import { useContextApi } from "next-common/context/api";

export default function useStandardVote({
  module = "convictionVoting",
  referendumIndex,
  isAye,
  addressVoteDelegations,
  isLoading,
  votingBalance,
  showReUseLocks,
}) {
  const dispatch = useDispatch();
  const [inputVoteBalance, setInputVoteBalance] = useState("0");
  const [voteLock, setVoteLock] = useState(0);
  const node = useChainSettings();
  const api = useContextApi();

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
      showReUseLocks={showReUseLocks}
    />
  );

  const getStandardVoteTx = useCallback(() => {
    let bnVoteBalance;
    try {
      bnVoteBalance = checkInputValue(
        inputVoteBalance,
        node.decimals,
        "vote balance",
        true,
      );
    } catch (err) {
      dispatch(newErrorToast(err.message));
      return;
    }

    if (bnVoteBalance.gt(votingBalance)) {
      dispatch(newErrorToast("Insufficient voting balance"));
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
  }, [
    dispatch,
    api,
    inputVoteBalance,
    node.decimals,
    votingBalance,
    module,
    referendumIndex,
    isAye,
    voteLock,
  ]);

  return { StandardVoteComponent, getStandardVoteTx };
}
