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

    let unsub = null;
    api.query[pallet].referendumInfoFor
      .entries((data) => {
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
      })
      .then((result) => (unsub = result));

    return () => unsub && unsub();
  }, [api, pallet]);

  return { activeReferenda, isLoading };
}
