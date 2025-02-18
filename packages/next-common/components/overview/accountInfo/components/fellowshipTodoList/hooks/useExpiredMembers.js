import { useContextMembers } from "../context/members";
import { useContextCoreParams } from "../context/coreParams";
import { useFilterExpiredMembers } from "next-common/components/fellowship/core/batchBump/useDemotionExpiredMembers";

export default function useExpiredMembers() {
  const { members, isLoading: isMembersLoading } = useContextMembers();
  const { params, isLoading: isParamsLoading } = useContextCoreParams();

  const expiredMembers = useFilterExpiredMembers({
    members,
    isMembersLoading,
    params,
    isParamsLoading,
  });

  return {
    expiredMembers,
    isLoading: isMembersLoading || isParamsLoading,
  };
}
