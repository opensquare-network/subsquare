import { useState } from "react";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { checkInputValue } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import SplitVote from "../splitVote";
import { encodeVoteSplitData } from "next-common/utils/moonPrecompiles/convictionVoting";

export default function useMoonSplitVote({
  module = "convictionVoting",
  referendumIndex,
  isLoading,
  votingBalance,
}) {
  const dispatch = useDispatch();
  const [ayeInputVoteBalance, setAyeInputVoteBalance] = useState("0");
  const [nayInputVoteBalance, setNayInputVoteBalance] = useState("0");
  const node = useChainSettings();

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const SplitVoteComponent = (
    <SplitVote
      isLoading={isLoading}
      ayeInputVoteBalance={ayeInputVoteBalance}
      setAyeInputVoteBalance={setAyeInputVoteBalance}
      nayInputVoteBalance={nayInputVoteBalance}
      setNayInputVoteBalance={setNayInputVoteBalance}
    />
  );

  const getSplitVoteTx = () => {
    let bnAyeVoteBalance;
    try {
      bnAyeVoteBalance = checkInputValue(
        ayeInputVoteBalance,
        node.decimals,
        "aye vote balance",
        true,
      );
    } catch (err) {
      showErrorToast(err.message);
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
      showErrorToast(err.message);
      return;
    }

    if (bnAyeVoteBalance.plus(bnNayVoteBalance).gt(votingBalance)) {
      showErrorToast("Insufficient voting balance");
      return;
    }

    if (module === "convictionVoting") {
      return encodeVoteSplitData({
        pollIndex: referendumIndex,
        aye: BigInt(bnAyeVoteBalance.toString()),
        nay: BigInt(bnNayVoteBalance.toString()),
      });
    } else if (module === "democracy") {
      throw new Error("The Moonbeam/Moonriver democracy precompile does not support split votes");
    } else {
      throw new Error("Unsupported module");
    }
  };

  return { SplitVoteComponent, getSplitVoteTx };
}
