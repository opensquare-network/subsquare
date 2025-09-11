import { useAllMemberEvidenceContext } from "next-common/components/collectives/core/context/evidenceMemberContext";
import { isAddressInGroup, isSameAddress } from "next-common/utils";
import { useCallback, useMemo } from "react";

export default function useEvidenceOnlyFilterFn() {
  const { evidences, isLoading } = useAllMemberEvidenceContext();
  const evidenceOwners = useMemo(
    () => evidences?.map((evidence) => evidence.who),
    [evidences],
  );

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

export function useWishTypeFilterFn() {
  const { evidences, isLoading } = useAllMemberEvidenceContext();
  return useCallback(
    (members, wishType) => {
      if (isLoading) {
        return members;
      }

      return members.filter((member) =>
        evidences.some(
          (evidence) =>
            isSameAddress(evidence.who, member.address) &&
            evidence.evidence[0].toLowerCase() === wishType.toLowerCase(),
        ),
      );
    },
    [evidences, isLoading],
  );
}
