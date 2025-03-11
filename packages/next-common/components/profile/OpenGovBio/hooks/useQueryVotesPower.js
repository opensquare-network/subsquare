import { useMemo } from "react";
import { useContextApi } from "next-common/context/api";
import useCall from "next-common/utils/hooks/useCall";
import BigNumber from "bignumber.js";
import { isNil } from "lodash-es";

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

function getMaxDelegationsAndTracks(votingValue) {
  if (!votingValue) {
    return { maxDelegations: null, tracks: null };
  }

  let maxDelegations = null;
  const tracksWithMaxDelegations = new Set();

  for (const [storageKey, votingOf] of votingValue) {
    const trackId = storageKey.args[1]?.toNumber();
    if (!isNil(trackId) && votingOf.isCasting) {
      const votesRaw = votingOf.asCasting.delegations.votes.toString();
      if (!isNaN(votesRaw)) {
        const votes = new BigNumber(votesRaw);
        if (maxDelegations === null || votes.isGreaterThan(maxDelegations)) {
          maxDelegations = votes;
          tracksWithMaxDelegations.clear();
          tracksWithMaxDelegations.add(trackId);
        } else if (votes.isEqualTo(maxDelegations)) {
          tracksWithMaxDelegations.add(trackId);
        }
      }
    }
  }

  const maxDelegationsStr = maxDelegations ? maxDelegations.toString() : null;
  const tracks =
    maxDelegations && !maxDelegations.isZero()
      ? tracksWithMaxDelegations.size
      : null;

  return { maxDelegations: maxDelegationsStr, tracks };
}

function getVotesPower(selfBalance, maxDelegations) {
  return new BigNumber(selfBalance || 0).plus(maxDelegations || 0).toString();
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
    const { maxDelegations, tracks } = getMaxDelegationsAndTracks(votingValue);
    const votesPower = getVotesPower(selfBalance, maxDelegations);

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
