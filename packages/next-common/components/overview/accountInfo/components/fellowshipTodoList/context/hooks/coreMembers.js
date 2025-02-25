import { useMemo } from "react";
import { useContextCoreMembers } from "../coreMembers";
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
  const [members, candidates] = useMemo(() => {
    const candidates = allMembers.filter((m) => m.rank === 0);
    const members = allMembers.filter((m) => m.rank > 0);
    return [members, candidates];
  }, [allMembers]);
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
