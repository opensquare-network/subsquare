import { useMemo } from "react";
import { useContextCoreMembers } from "../coreMembers";
import { partition } from "lodash-es";
import { useContextCollectivesMembers } from "../collectivesMember";

export function useContextCoreMembersWithRank() {
  const { members: coreMembers, isLoading: isCoreMembersLoading } =
    useContextCoreMembers();
  const { members: collectiveMembers, isLoading: isCollectiveMembersLoading } =
    useContextCollectivesMembers();

  const coreMembersWithRank = useMemo(() => {
    return (coreMembers || []).map((coreMember) => {
      const collectiveMember = (collectiveMembers || []).find(
        (m) => m.address === coreMember.address,
      );
      return {
        ...coreMember,
        rank: collectiveMember?.rank,
      };
    });
  }, [coreMembers, collectiveMembers]);

  return {
    members: coreMembersWithRank,
    isLoading: isCoreMembersLoading || isCollectiveMembersLoading,
  };
}

function useGroupingCoreMembers() {
  const { members: allMembers, isLoading } = useContextCoreMembersWithRank();
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
