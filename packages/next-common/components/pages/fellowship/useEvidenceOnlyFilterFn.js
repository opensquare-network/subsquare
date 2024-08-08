import { useAllMemberEvidenceContext } from "next-common/components/collectives/core/context/evidenceMemberContext";
import { useCallback } from "react";

export default function useEvidenceOnlyFilterFn() {
  const { evidences, isLoading } = useAllMemberEvidenceContext();

  return useCallback(
    (members) => {
      if (isLoading) {
        return members;
      }
      return members.filter((member) =>
        evidences.some((evidence) => evidence.who === member.address),
      );
    },
    [evidences, isLoading],
  );
}
