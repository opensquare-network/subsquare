import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { checkInputValue } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import SplitAbstainVote from "../splitAbstainVote";
import { useContextApi } from "next-common/context/api";

export default function useSplitAbstainVote({
  referendumIndex,
  isLoading,
  votingBalance,
}) {
  const dispatch = useDispatch();
  const [ayeInputVoteBalance, setAyeInputVoteBalance] = useState("0");
  const [nayInputVoteBalance, setNayInputVoteBalance] = useState("0");
  const [abstainInputVoteBalance, setAbstainInputVoteBalance] = useState("0");
  const node = useChainSettings();
  const api = useContextApi();

  const SplitAbstainVoteComponent = (
    <SplitAbstainVote
      isLoading={isLoading}
      ayeInputVoteBalance={ayeInputVoteBalance}
      setAyeInputVoteBalance={setAyeInputVoteBalance}
      nayInputVoteBalance={nayInputVoteBalance}
      setNayInputVoteBalance={setNayInputVoteBalance}
      abstainInputVoteBalance={abstainInputVoteBalance}
      setAbstainInputVoteBalance={setAbstainInputVoteBalance}
    />
  );

  const getSplitAbstainVoteTx = useCallback(() => {
    let bnAbstainVoteBalance;
    try {
      bnAbstainVoteBalance = checkInputValue(
        abstainInputVoteBalance,
        node.decimals,
        "abstain vote balance",
        true,
      );
    } catch (err) {
      dispatch(newErrorToast(err.message));
      return;
    }

    let bnAyeVoteBalance;
    try {
      bnAyeVoteBalance = checkInputValue(
        ayeInputVoteBalance,
        node.decimals,
        "aye vote balance",
        true,
      );
    } catch (err) {
      dispatch(newErrorToast(err.message));
      return;
    }

    let bnNayVoteBalance;
    try {
      bnNayVoteBalance = checkInputValue(
        nayInputVoteBalance,
        node.decimals,
        "nay vote balance",
        true,
      );
    } catch (err) {
      dispatch(newErrorToast(err.message));
      return;
    }

    if (
      bnAyeVoteBalance
        .plus(bnNayVoteBalance)
        .plus(bnAbstainVoteBalance)
        .gt(votingBalance)
    ) {
      dispatch(newErrorToast("Insufficient voting balance"));
      return;
    }

    return api.tx.convictionVoting.vote(referendumIndex, {
      SplitAbstain: {
        aye: bnAyeVoteBalance.toString(),
        nay: bnNayVoteBalance.toString(),
        abstain: bnAbstainVoteBalance.toString(),
      },
    });
  }, [
    dispatch,
    api,
    ayeInputVoteBalance,
    nayInputVoteBalance,
    abstainInputVoteBalance,
    node.decimals,
    votingBalance,
    referendumIndex,
  ]);

  return {
    SplitAbstainVoteComponent,
    getSplitAbstainVoteTx,
  };
}
