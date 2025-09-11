import { useActiveReferendaContext } from "next-common/context/activeReferenda";
import { useCoreFellowshipPallet } from "next-common/context/collectives/collectives";
import { isSameAddress } from "next-common/utils";
import { useMemo } from "react";

export default function useRelatedReferenda(address, methods) {
  const pallet = useCoreFellowshipPallet();
  const { activeReferenda, isLoading } = useActiveReferendaContext();
  const relatedReferenda = useMemo(() => {
    return activeReferenda.filter(({ call }) => {
      if (!call) {
        return false;
      }

      const { section, method } = call;
      if (section !== pallet) {
        return false;
      }
      if (!methods.includes(method)) {
        return false;
      }

      const nameArg = call.args.find(({ name }) => name === "who");
      return isSameAddress(nameArg?.value, address);
    });
  }, [activeReferenda, address, pallet, methods]);

  return {
    relatedReferenda,
    isLoading,
  };
}
