import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";
import { useReferendaFellowshipPallet } from "next-common/context/collectives/collectives";

export default function useSubAllActiveReferenda() {
  const api = useContextApi();
  const [activeReferenda, setActiveReferenda] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const pallet = useReferendaFellowshipPallet();

  useEffect(() => {
    if (!api) {
      return;
    }

    api.query[pallet].referendumInfoFor.entries().then((data) => {
      const result = data
        .map((item) => {
          const [
            {
              args: [referendumIndex],
            },
            referendum,
          ] = item;
          return [referendumIndex.toNumber(), referendum.unwrap()?.isOngoing];
        })
        .filter(([, isOngoing]) => isOngoing)
        .map(([referendumIndex]) => referendumIndex);

      setActiveReferenda(result);
      setIsLoading(false);
    });
  }, [api, pallet]);

  return { activeReferenda, isLoading };
}
