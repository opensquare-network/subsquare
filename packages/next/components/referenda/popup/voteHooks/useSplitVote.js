import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { checkInputValue } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import SplitVote from "../splitVote";
import { useContextApi } from "next-common/context/api";

export default function useSplitVote({
  module = "convictionVoting",
  referendumIndex,
  isLoading,
  votingBalance,
  showReUseLocks,
}) {
  const dispatch = useDispatch();
  const [ayeInputVoteBalance, setAyeInputVoteBalance] = useState("0");
  const [nayInputVoteBalance, setNayInputVoteBalance] = useState("0");
  const node = useChainSettings();
  const api = useContextApi();

  const SplitVoteComponent = (
    <SplitVote
      isLoading={isLoading}
      ayeInputVoteBalance={ayeInputVoteBalance}
      setAyeInputVoteBalance={setAyeInputVoteBalance}
      nayInputVoteBalance={nayInputVoteBalance}
      setNayInputVoteBalance={setNayInputVoteBalance}
      showReUseLocks={showReUseLocks}
    />
  );

  const getSplitVoteTx = useCallback(() => {
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

    if (bnAyeVoteBalance.plus(bnNayVoteBalance).gt(votingBalance)) {
      dispatch(newErrorToast("Insufficient voting balance"));
      return;
    }

    return api.tx[module].vote(referendumIndex, {
      Split: {
        aye: bnAyeVoteBalance.toString(),
        nay: bnNayVoteBalance.toString(),
      },
    });
  }, [
    dispatch,
    api,
    ayeInputVoteBalance,
    nayInputVoteBalance,
    node.decimals,
    votingBalance,
    module,
    referendumIndex,
  ]);

  return { SplitVoteComponent, getSplitVoteTx };
}
