import { useState } from "react";
import { checkInputValue } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import SplitVote from "../splitVote";
import { useContextApi } from "next-common/context/api";
import { useTxBuilder } from "next-common/hooks/useTxBuilder";

export default function useSplitVote({
  module = "convictionVoting",
  referendumIndex,
  isLoading,
  votingBalance,
}) {
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
    />
  );

  const { getTxFuncForSubmit, getTxFuncForFee } = useTxBuilder(
    (toastError) => {
      let bnAyeVoteBalance;
      try {
        bnAyeVoteBalance = checkInputValue(
          ayeInputVoteBalance,
          node.decimals,
          "aye vote balance",
          true,
        );
      } catch (err) {
        toastError(err.message);
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
        toastError(err.message);
        return;
      }

      if (bnAyeVoteBalance.plus(bnNayVoteBalance).gt(votingBalance)) {
        toastError("Insufficient voting balance");
        return;
      }

      return api.tx[module].vote(referendumIndex, {
        Split: {
          aye: bnAyeVoteBalance.toString(),
          nay: bnNayVoteBalance.toString(),
        },
      });
    },
    [
      api,
      ayeInputVoteBalance,
      nayInputVoteBalance,
      node.decimals,
      votingBalance,
      module,
      referendumIndex,
    ],
  );

  return {
    SplitVoteComponent,
    getSplitVoteTx: getTxFuncForSubmit,
    getSplitVoteFeeTx: getTxFuncForFee,
  };
}
