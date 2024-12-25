import { useActiveReferendaContext } from "next-common/context/activeReferenda";
import { useMemo } from "react";
import { useCoreFellowshipPallet } from "next-common/context/collectives/collectives";
import { useAllMemberEvidenceContext } from "next-common/components/collectives/core/context/evidenceMemberContext";

function useApproveAndPromoteReferenda() {
  const pallet = useCoreFellowshipPallet();
  const { activeReferenda, isLoading: isLoadingActiveReferenda } =
    useActiveReferendaContext();

  const filteredReferenda = useMemo(() => {
    if (isLoadingActiveReferenda) {
      return;
    }

    return activeReferenda
      .map(({ referendumIndex, call }) => {
        if (!call) {
          return;
        }

        const { section, method } = call;
        if (section !== pallet) {
          return;
        }
        if (!["approve", "promote", "promoteFast"].includes(method)) {
          return;
        }

        const nameArg = call.args.find(({ name }) => name === "who");
        const who = nameArg?.value;

        return { referendumIndex, method, who };
      })
      .filter(Boolean);
  }, [pallet, activeReferenda, isLoadingActiveReferenda]);

  return {
    referenda: filteredReferenda,
    isLoading: isLoadingActiveReferenda,
  };
}

export default function useEvidencesCombineReferenda() {
  const { evidences, isLoading: isLoadingEvidences } =
    useAllMemberEvidenceContext();

  const { referenda, isLoading: isLoadingApproveAndPromoteReferenda } =
    useApproveAndPromoteReferenda();

  const isLoading = isLoadingEvidences || isLoadingApproveAndPromoteReferenda;

  const combined = useMemo(() => {
    if (isLoading) {
      return evidences;
    }

    return evidences.map((evidence) => {
      const referendum = referenda.find(
        (referendum) => evidence.who === referendum.who,
      );

      return {
        ...referendum,
        ...evidence,
      };
    });
  }, [referenda, evidences, isLoading]);

  return {
    evidences: combined,
    isLoading,
  };
}
