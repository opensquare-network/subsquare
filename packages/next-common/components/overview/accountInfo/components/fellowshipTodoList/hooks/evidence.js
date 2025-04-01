import {
  useFilterEvidenceByWish,
  useTodoEvidences,
} from "next-common/components/fellowship/core/memberWarnings";
import { useContextCoreMembersWithRank } from "../context/hooks/coreMembers";
import { useMemo } from "react";

function useAllMemberEvidences() {
  const { members } = useContextCoreMembersWithRank();
  const membersOrCandidates = useMemo(
    () => (members || []).filter((m) => m.rank >= 0),
    [members],
  );
  const { all: allEvidences } = useTodoEvidences(membersOrCandidates);
  return allEvidences;
}

export function useMemberPromotions() {
  const allEvidences = useAllMemberEvidences();
  return useFilterEvidenceByWish(allEvidences, "promotion");
}

export function useMemberRetention() {
  const allEvidences = useAllMemberEvidences();
  return useFilterEvidenceByWish(allEvidences, "retention");
}
