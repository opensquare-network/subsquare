import { useActiveReferendaContext } from "next-common/context/activeReferenda";
import useAllCollectiveMemberEvidence from "./useAllCollectiveMemberEvidence";
import { useMemo } from "react";
import { useCoreFellowshipPallet } from "next-common/context/collectives/collectives";

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
          return false;
        }

        const { section, method } = call;
        if (section !== pallet) {
          return;
        }
        if (!["approve", "promote"].includes(method)) {
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
    useAllCollectiveMemberEvidence();

  const { referenda, isLoading: isLoadingApproveAndPromoteReferenda } =
    useApproveAndPromoteReferenda();

  const isLoading = isLoadingEvidences || isLoadingApproveAndPromoteReferenda;

  const combined = useMemo(() => {
    if (isLoading) {
      return;
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
