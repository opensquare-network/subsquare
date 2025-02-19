import { useContextCoreParams } from "../coreParams";
import { useFilterExpiredMembers } from "next-common/components/fellowship/core/batchBump/useDemotionExpiredMembers";
import { useCandidateCoreMembers, useEligibleCoreMembers } from "./members";

function useDemotionExpired({ members, isMembersLoading }) {
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

export function useDemotionExpiredMembers() {
  const { members, isLoading: isMembersLoading } = useEligibleCoreMembers();
  return useDemotionExpired({ members, isMembersLoading });
}

export function useDemotionExpiredCandidates() {
  const { members, isLoading: isMembersLoading } = useCandidateCoreMembers();
  return useDemotionExpired({ members, isMembersLoading });
}
