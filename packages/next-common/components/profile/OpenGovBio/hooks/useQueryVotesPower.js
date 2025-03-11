import { useMemo } from "react";
import { useContextApi } from "next-common/context/api";
import useCall from "next-common/utils/hooks/useCall";
import BigNumber from "bignumber.js";

function useQueryAccountBalance(address) {
  const api = useContextApi();
  const { value: accountInfo, loaded: isBalanceLoaded } = useCall(
    api?.query?.system?.account,
    [address],
  );

  return { accountInfo, isBalanceLoaded };
}

function useQueryVotingData(address) {
  const api = useContextApi();
  const { value: votingValue, loaded: isVotingLoaded } = useCall(
    api?.query?.convictionVoting?.votingFor?.entries,
    [address],
  );

  return { votingValue, isVotingLoaded };
}

function getSelfBalance(accountInfo) {
  const selfBalanceRaw = accountInfo?.data?.free?.toString();
  if (!selfBalanceRaw || isNaN(selfBalanceRaw)) {
    return "0";
  }

  return new BigNumber(selfBalanceRaw).multipliedBy(6).toString();
}

function getMaxDelegations(votingValue) {
  if (!votingValue) {
    return null;
  }

  let maxDelegations = new BigNumber(0);

  for (const [, votingOf] of votingValue) {
    if (votingOf.isCasting) {
      const votesRaw = votingOf.asCasting.delegations.votes.toString();
      if (!isNaN(votesRaw)) {
        const votes = new BigNumber(votesRaw);
        if (votes.isGreaterThan(maxDelegations)) {
          maxDelegations = votes;
        }
      }
    }
  }

  return maxDelegations.toString();
}

function getVotesPower(selfBalance, maxDelegations) {
  return new BigNumber(selfBalance || 0).plus(maxDelegations || 0).toString();
}

function getTracks(votingValue) {
  return (votingValue || []).length;
}

export default function useQueryVotesPower(address = "") {
  const api = useContextApi();
  const { accountInfo, isBalanceLoaded } = useQueryAccountBalance(address);
  const { votingValue, isVotingLoaded } = useQueryVotingData(address);

  const result = useMemo(() => {
    if (
      !api ||
      !address ||
      !isVotingLoaded ||
      !isBalanceLoaded ||
      !api.query.convictionVoting ||
      !api.query.system
    ) {
      return null;
    }

    const selfBalance = getSelfBalance(accountInfo);
    const maxDelegations = getMaxDelegations(votingValue);
    const votesPower = getVotesPower(selfBalance, maxDelegations);
    const tracks = getTracks(votingValue);

    return {
      selfBalance,
      maxDelegations,
      votesPower,
      tracks,
    };
  }, [api, address, votingValue, isVotingLoaded, isBalanceLoaded, accountInfo]);

  return {
    result,
    isLoading: !(isVotingLoaded && isBalanceLoaded),
  };
}
