import { useMemo } from "react";
import { usePageProps } from "next-common/context/page";
import { useSingleMemberStatus } from "next-common/components/fellowship/collective/hook/useFellowshipCoreMembersFilter";

const useFellowshipMemberInfo = (address) => {
  const { status, isLoading: isStatusLoading } = useSingleMemberStatus({
    address,
  });
  const { fellowshipMembers } = usePageProps();

  const memberInfo = useMemo(() => {
    const member = fellowshipMembers?.find((m) => m.address === address);
    if (!member || !isStatusLoading) return null;

    return {
      ...status,
      rank: member.rank,
    };
  }, [address, fellowshipMembers, isStatusLoading, status]);

  return {
    ...memberInfo,
  };
};

export default useFellowshipMemberInfo;
