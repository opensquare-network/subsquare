import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";
import { useReferendaFellowshipPallet } from "next-common/context/collectives/collectives";

export default function useCollectiveActiveReferenda() {
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
          return {
            referendumIndex: referendumIndex.toNumber(),
            unwrappedReferendum: referendum.unwrap(),
          };
        })
        .filter(({ unwrappedReferendum }) => unwrappedReferendum?.isOngoing)
        .map(({ referendumIndex, unwrappedReferendum }) => {
          const ongoingReferendum = unwrappedReferendum.asOngoing;
          return {
            referendumIndex,
            trackId: ongoingReferendum?.track?.toNumber(),
          };
        });

      setActiveReferenda(result);
      setIsLoading(false);
    });
  }, [api, pallet]);

  return { activeReferenda, isLoading };
}
