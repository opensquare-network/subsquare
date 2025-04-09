import {
  useFilterEvidenceByWish,
  useTodoEvidences,
} from "next-common/components/fellowship/core/memberWarnings";
import {
  useCandidateCoreMembers,
  useNonCandidateCoreMembers,
} from "../context/hooks/coreMembers";

function useMemberEvidences() {
  const { members } = useNonCandidateCoreMembers();
  const { all } = useTodoEvidences(members);
  return all;
}

function useCandidateEvidences() {
  const { members } = useCandidateCoreMembers();
  const { all } = useTodoEvidences(members);
  return all;
}

export function useMemberPromotionEvidences() {
  const allMemberEvidences = useMemberEvidences();
  return useFilterEvidenceByWish(allMemberEvidences, "promotion");
}

export function useCandidatePromotionEvidences() {
  const allCandidateEvidences = useCandidateEvidences();
  return useFilterEvidenceByWish(allCandidateEvidences, "promotion");
}

export function useMemberRetentionEvidences() {
  const allMemberEvidences = useMemberEvidences();
  return useFilterEvidenceByWish(allMemberEvidences, "retention");
}
