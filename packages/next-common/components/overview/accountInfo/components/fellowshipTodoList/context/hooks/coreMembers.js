import { useMemo } from "react";
import { useContextCoreMembers } from "../coreMembers";
import { partition } from "lodash-es";

function useGroupingCoreMembers() {
  const { members: allMembers, isLoading } = useContextCoreMembers();
  const [members, candidates] = useMemo(
    () => partition(allMembers, (m) => m.rank > 0),
    [allMembers],
  );
  return { members, candidates, isLoading };
}

export function useNonCandidateCoreMembers() {
  const { members, isLoading } = useGroupingCoreMembers();
  return { members, isLoading };
}

export function useCandidateCoreMembers() {
  const { candidates: members, isLoading } = useGroupingCoreMembers();
  return { members, isLoading };
}
