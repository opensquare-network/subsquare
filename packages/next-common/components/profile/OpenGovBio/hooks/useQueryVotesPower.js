import { useMemo } from "react";
import { useContextApi } from "next-common/context/api";
import useCall from "next-common/utils/hooks/useCall";
import BigNumber from "bignumber.js";
import { useUserAccountInfo } from "next-common/context/user/account";

function useQuerySelfBalance() {
  const { info, isLoading } = useUserAccountInfo();

  return { selfBalance: info?.data?.total?.toString() || "0", isLoading };
}

function useQueryVotingData(address) {
  const api = useContextApi();
  const { value: votingValue, loaded: isVotingLoaded } = useCall(
    api?.query?.convictionVoting?.votingFor?.entries,
    [address],
  );

  return { votingValue, isVotingLoaded };
}

export function getVotesPower(selfBalance, maxDelegations) {
  const maxVotingBySelfBalance = new BigNumber(selfBalance).multipliedBy(6);

  return maxVotingBySelfBalance.plus(maxDelegations || 0).toString();
}

function getMaxDelegations(votingValue) {
  if (!votingValue) {
    return 0;
  }

  let maxDelegations = 0;

  for (const [, votingOf] of votingValue) {
    if (!votingOf.isCasting) {
      return;
    }

    const votesRaw = votingOf?.asCasting?.delegations?.votes?.toString() || "0";
    const votes = new BigNumber(votesRaw);
    if (votes.isGreaterThan(maxDelegations)) {
      maxDelegations = votes;
    }
  }

  return maxDelegations;
}

export default function useQueryVotesPower(address = "") {
  const api = useContextApi();
  const { selfBalance, isLoading: isBalanceLoading } = useQuerySelfBalance();
  const { votingValue, isVotingLoaded } = useQueryVotingData(address);

  const result = useMemo(() => {
    if (
      !api ||
      !address ||
      !isVotingLoaded ||
      isBalanceLoading ||
      !api.query.convictionVoting
    ) {
      return null;
    }

    const maxDelegations = getMaxDelegations(votingValue);
    const votesPower = getVotesPower(selfBalance, maxDelegations);

    return {
      selfBalance,
      maxDelegations,
      votesPower,
    };
  }, [
    api,
    address,
    isVotingLoaded,
    isBalanceLoading,
    votingValue,
    selfBalance,
  ]);

  return {
    result,
    isLoading: !isVotingLoaded || isBalanceLoading,
  };
}
