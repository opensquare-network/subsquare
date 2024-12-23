import { useActiveReferendaContext } from "next-common/context/activeReferenda";
import { useCoreFellowshipPallet } from "next-common/context/collectives/collectives";
import { useMemo } from "react";

export default function useRelatedRetentionReferenda(address) {
  const pallet = useCoreFellowshipPallet();
  const { activeReferenda, isLoading } = useActiveReferendaContext();
  const activeRetentionReferenda = useMemo(() => {
    return activeReferenda.filter(({ call }) => {
      if (!call) {
        return false;
      }

      const { section, method } = call;
      if (section !== pallet) {
        return false;
      }
      if (!["approve"].includes(method)) {
        return false;
      }

      const nameArg = call.args.find(({ name }) => name === "who");
      return nameArg?.value === address;
    });
  }, [activeReferenda, address, pallet]);

  return {
    relatedReferenda: activeRetentionReferenda,
    isLoading,
  };
}
