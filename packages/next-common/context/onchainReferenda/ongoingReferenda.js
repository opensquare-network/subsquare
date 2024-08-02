import { useMemo } from "react";
import { useOnChainReferendaContext } from ".";
import { eachOngoingReferenda } from "next-common/utils/referenda";

export default function useOnChainOngoingReferenda() {
  const { referenda, isLoading } = useOnChainReferendaContext();
  const ongoingReferenda = useMemo(() => {
    if (isLoading) {
      return [];
    }
    return Array.from(eachOngoingReferenda(referenda));
  }, [isLoading, referenda]);
  return {
    ongoingReferenda,
    isLoading,
  };
}
