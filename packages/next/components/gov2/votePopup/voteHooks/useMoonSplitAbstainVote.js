import { useState } from "react";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { checkInputValue } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import SplitAbstainVote from "../splitAbstainVote";
import { encodeVoteSplitAbstainData } from "next-common/utils/moonPrecompiles/convictionVoting";

export default function useMoonSplitAbstainVote({
  referendumIndex,
  isLoading,
  votingBalance,
}) {
  const dispatch = useDispatch();
  const [ayeInputVoteBalance, setAyeInputVoteBalance] = useState("0");
  const [nayInputVoteBalance, setNayInputVoteBalance] = useState("0");
  const [abstainInputVoteBalance, setAbstainInputVoteBalance] = useState("0");
  const node = useChainSettings();

  const showErrorToast = (message) => dispatch(newErrorToast(message));

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

  const getSplitAbstainVoteTx = () => {
    let bnAbstainVoteBalance;
    try {
      bnAbstainVoteBalance = checkInputValue(
        abstainInputVoteBalance,
        node.decimals,
        "abstain vote balance",
        true,
      );
    } catch (err) {
      showErrorToast(err.message);
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

    if (
      bnAyeVoteBalance
        .plus(bnNayVoteBalance)
        .plus(bnAbstainVoteBalance)
        .gt(votingBalance)
    ) {
      showErrorToast("Insufficient voting balance");
      return;
    }

    return encodeVoteSplitAbstainData({
      pollIndex: referendumIndex,
      aye: BigInt(bnAyeVoteBalance.toString()),
      nay: BigInt(bnNayVoteBalance.toString()),
      abstain: BigInt(bnAbstainVoteBalance.toString()),
    });
  };

  return {
    SplitAbstainVoteComponent,
    getSplitAbstainVoteTx,
  };
}
