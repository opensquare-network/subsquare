import { useMemo } from "react";
import { useContextMembers } from "../members";
import { partition } from "lodash-es";

function useGroupingCoreMembers() {
  const { members, isLoading } = useContextMembers();
  const [eligibles, candidates] = useMemo(
    () => partition(members, (m) => m.rank > 0),
    [members],
  );
  return { eligibles, candidates, isLoading };
}

export function useEligibleCoreMembers() {
  const { eligibles: members, isLoading } = useGroupingCoreMembers();
  return { members, isLoading };
}

export function useCandidateCoreMembers() {
  const { candidates: members, isLoading } = useGroupingCoreMembers();
  return { members, isLoading };
}
