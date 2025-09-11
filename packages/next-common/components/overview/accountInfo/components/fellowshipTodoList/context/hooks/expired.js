import { useContextCoreParams } from "../coreParams";
import { useFilterExpiredMembers } from "next-common/components/fellowship/core/batchBump/useDemotionExpiredMembers";
import {
  useCandidateCoreMembers,
  useNonCandidateCoreMembers,
} from "./coreMembers";

function useDemotionExpired({ members, isMembersLoading }) {
  const { params, isLoading: isParamsLoading } = useContextCoreParams();

  const expiredMembers = useFilterExpiredMembers({
    members,
    isMembersLoading,
    params,
    isParamsLoading,
  });

  return {
    members: expiredMembers,
    isLoading: isMembersLoading || isParamsLoading,
  };
}

export function useDemotionExpiredMembers() {
  const { members, isLoading: isMembersLoading } = useNonCandidateCoreMembers();
  return useDemotionExpired({ members, isMembersLoading });
}

export function useDemotionExpiredCandidates() {
  const { members, isLoading: isMembersLoading } = useCandidateCoreMembers();
  return useDemotionExpired({ members, isMembersLoading });
}
