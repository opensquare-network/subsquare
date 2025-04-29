import { useMemo } from "react";
import { usePageProps } from "next-common/context/page";
import useSubFellowshipCoreMember from "next-common/hooks/fellowship/core/useSubFellowshipCoreMember";
import { isSameAddress } from "next-common/utils";

export default function useFellowshipMemberInfo(address) {
  const { member: coreStatus, isLoading: isStatusLoading } =
    useSubFellowshipCoreMember(address);
  const { fellowshipMembers } = usePageProps();

  return useMemo(() => {
    if (isStatusLoading || !coreStatus) {
      return null;
    }

    const member = fellowshipMembers?.find((m) =>
      isSameAddress(m?.address, address),
    );
    return member
      ? {
          isActive: coreStatus?.isActive,
          rank: member?.rank,
        }
      : null;
  }, [address, fellowshipMembers, isStatusLoading, coreStatus]);
}
