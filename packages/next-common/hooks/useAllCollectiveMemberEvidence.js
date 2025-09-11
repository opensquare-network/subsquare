import { useContextApi } from "next-common/context/api";
import { useCoreFellowshipPallet } from "next-common/context/collectives/collectives";
import { useEffect, useState } from "react";

export default function useAllCollectiveMemberEvidence() {
  const api = useContextApi();
  const pallet = useCoreFellowshipPallet();
  const [evidences, setEvidences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!api || !pallet) {
      return;
    }

    api.query[pallet]?.memberEvidence.entries().then((data) => {
      const result = data.map(([key, value]) => {
        const {
          args: [who],
        } = key;
        return {
          who: who.toJSON(),
          evidence: value.toJSON(),
        };
      });
      setEvidences(result);
      setIsLoading(false);
    });
  }, [api, pallet]);

  return {
    evidences,
    isLoading,
  };
}
