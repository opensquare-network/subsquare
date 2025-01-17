import { useAllMemberEvidenceContext } from "next-common/components/collectives/core/context/evidenceMemberContext";
import { isAddressInGroup } from "next-common/utils";
import { useCallback } from "react";

export default function useEvidenceOnlyFilterFn() {
  const { evidences, isLoading } = useAllMemberEvidenceContext();
  const evidenceOwners = evidences?.map((evidence) => evidence.who);

  return useCallback(
    (members) => {
      if (isLoading) {
        return members;
      }
      return members.filter((member) =>
        isAddressInGroup(member.address, evidenceOwners),
      );
    },
    [evidenceOwners, isLoading],
  );
}
