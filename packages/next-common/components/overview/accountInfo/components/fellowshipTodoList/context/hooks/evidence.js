import { useMemo } from "react";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useAllMemberEvidenceContext } from "next-common/components/collectives/core/context/evidenceMemberContext";
import { isSameAddress } from "next-common/utils";

export function useContextMyEvidence() {
  const realAddress = useRealAddress();
  const { evidences, isLoading } = useAllMemberEvidenceContext();
  const evidence = useMemo(
    () =>
      (evidences || []).find((m) => isSameAddress(m.who, realAddress))
        ?.evidence,
    [realAddress, evidences],
  );
  return { evidence, isLoading };
}
