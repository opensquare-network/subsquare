import { useState } from "react";
import { useDispatch } from "react-redux";
import useApi from "next-common/utils/hooks/useApi";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { checkInputValue } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import DirectVote from "../directVote";

export default function useStandardVote({
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
      isAye={isAye}
      addressVoteDelegations={addressVoteDelegations}
      isLoading={isLoading}
      inputVoteBalance={inputVoteBalance}
      setInputVoteBalance={setInputVoteBalance}
      voteLock={voteLock}
      setVoteLock={setVoteLock}
      node={node}
    />
  );

  const getStandardVoteTx = () => {
    let bnVoteBalance;
    try {
      bnVoteBalance = checkInputValue(
        inputVoteBalance,
        node.decimals,
        "vote balance"
      );
    } catch (err) {
      showErrorToast(err.message);
      return;
    }

    if (bnVoteBalance.gt(votingBalance)) {
      showErrorToast("Insufficient voting balance");
      return;
    }

    return api.tx.convictionVoting.vote(referendumIndex, {
      Standard: {
        balance: bnVoteBalance.toString(),
        vote: {
          aye: isAye,
          conviction: voteLock,
        },
      },
    });
  };

  return { StandardVoteComponent, getStandardVoteTx };
}
