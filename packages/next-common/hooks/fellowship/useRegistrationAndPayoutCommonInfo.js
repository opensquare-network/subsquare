import { useMemo } from "react";
import { useMySalaryClaimantFromContext } from "next-common/context/fellowship/myClaimant";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useFellowshipCollectiveMembers } from "next-common/hooks/fellowship/core/useFellowshipCollectiveMembers";
import { useFellowshipSalaryStats } from "next-common/hooks/fellowship/salary/useFellowshipSalaryStats";

export default function useRegistrationAndPayoutCommonInfo() {
  const address = useRealAddress();
  const { members } = useFellowshipCollectiveMembers();
  const memberAddrs = (members || []).map((item) => item.address);
  const { isLoading: isLoading, claimant } =
    useMySalaryClaimantFromContext() ?? { claimant: null, isLoading: false };
  const status = useFellowshipSalaryStats();

  return useMemo(
    () => ({
      address,
      memberAddrs,
      claimant,
      isLoading,
      status,
    }),
    [address, claimant, isLoading, memberAddrs, status],
  );
}
