import { useState } from "react";
import { checkInputValue } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import DirectVote from "../directVote";
import { useContextApi } from "next-common/context/api";
import { useTxBuilder } from "next-common/hooks/useTxBuilder";

export default function useStandardVote({
  module = "convictionVoting",
  referendumIndex,
  isAye,
  addressVoteDelegations,
  isLoading,
  votingBalance,
  showReUseLocks,
}) {
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

  const { getTxFuncForSubmit, getTxFuncForFee } = useTxBuilder(
    (toastError) => {
      let bnVoteBalance;
      try {
        bnVoteBalance = checkInputValue(
          inputVoteBalance,
          node.decimals,
          "vote balance",
          true,
        );
      } catch (err) {
        toastError(err.message);
        return;
      }

      if (bnVoteBalance.gt(votingBalance)) {
        toastError("Insufficient voting balance");
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
    },
    [
      api,
      inputVoteBalance,
      node.decimals,
      votingBalance,
      module,
      referendumIndex,
      isAye,
      voteLock,
    ],
  );

  return {
    StandardVoteComponent,
    getStandardVoteTx: getTxFuncForSubmit,
    getStandardVoteFeeTx: getTxFuncForFee,
  };
}
