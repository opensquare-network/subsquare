import { useMemo } from "react";
import { useContextApi } from "next-common/context/api";
import useCall from "next-common/utils/hooks/useCall";
import { useUserAccountInfo } from "next-common/context/user/account";
import { getVotesPower } from "next-common/components/profile/OpenGovBio/hooks/useQueryVotesPower";

function useQuerySelfBalance() {
  const { info, isLoading } = useUserAccountInfo();

  return { selfBalance: info?.data?.free?.toString() || "0", isLoading };
}

function useQueryMaxDelegations(address) {
  const api = useContextApi();
  const { value, loaded } = useCall(api?.query?.democracy?.votingOf, [address]);

  const delegations = value?.toJSON()?.direct?.delegations?.votes || "0";

  return { delegations, loaded };
}

export default function useQueryVotesPower(address = "") {
  const api = useContextApi();
  const { selfBalance, isLoading: isBalanceLoading } = useQuerySelfBalance();
  const { delegations, loaded: isMaxDelegationsLoaded } =
    useQueryMaxDelegations(address);

  const result = useMemo(() => {
    if (
      !api ||
      !address ||
      !isMaxDelegationsLoaded ||
      isBalanceLoading ||
      !api.query.democracy.votingOf
    ) {
      return null;
    }

    const votesPower = getVotesPower(selfBalance, delegations);

    return {
      selfBalance,
      delegations,
      votesPower,
    };
  }, [
    api,
    address,
    isMaxDelegationsLoaded,
    isBalanceLoading,
    delegations,
    selfBalance,
  ]);

  return {
    result,
    isLoading: !isMaxDelegationsLoaded || isBalanceLoading,
  };
}
