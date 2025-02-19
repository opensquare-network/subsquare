import { useContextMembers } from "../members";
import { useContextCoreParams } from "../coreParams";
import { useFilterExpiredMembers } from "next-common/components/fellowship/core/batchBump/useDemotionExpiredMembers";

export default function useDemotionExpiredMembers() {
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
