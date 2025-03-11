import { useMemo } from "react";
import { useContextApi } from "next-common/context/api";
import useCall from "next-common/utils/hooks/useCall";
import BigNumber from "bignumber.js";

export default function useQueryVotesPower(address = "") {
  const api = useContextApi();

  const { value: votingValue, loaded: isVotingLoaded } = useCall(
    api?.query?.convictionVoting?.votingFor?.entries,
    [address],
  );

  const { value: accountInfo, loaded: isBalanceLoaded } = useCall(
    api?.query?.system?.account,
    [address],
  );

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

    const selfBalanceRaw = accountInfo?.data?.free?.toString();
    const selfBalance = selfBalanceRaw
      ? new BigNumber(selfBalanceRaw).multipliedBy(6).toString()
      : "0";

    if (!votingValue) {
      return { selfBalance, maxDelegations: null, tracks: 0 };
    }

    let maxDelegations = new BigNumber(0);

    for (const [, votingOf] of votingValue) {
      if (votingOf.isCasting) {
        const votes = new BigNumber(
          votingOf.asCasting.delegations.votes.toString(),
        );
        if (votes.isGreaterThan(maxDelegations)) {
          maxDelegations = votes;
        }
      }
    }

    const votesPower = new BigNumber(selfBalance || 0).plus(
      maxDelegations || 0,
    );

    return {
      selfBalance,
      maxDelegations: maxDelegations.toString(),
      votesPower: votesPower.toString(),
      tracks: (votingValue || []).length,
    };
  }, [api, address, votingValue, isVotingLoaded, isBalanceLoaded, accountInfo]);

  return {
    result,
    isLoading: !(isVotingLoaded && isBalanceLoaded),
  };
}
