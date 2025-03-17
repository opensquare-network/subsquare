import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";
import { useSalaryFellowshipPallet } from "next-common/context/collectives/collectives";

export default function useSalaryClaimant(address) {
  const api = useContextApi();
  const [claimant, setClaimant] = useState(null);
  const [loading, setLoading] = useState(true);
  const pallet = useSalaryFellowshipPallet();

  useEffect(() => {
    if (!address || !api?.query?.[pallet]?.claimant) {
      setLoading(false);
      return;
    }

    let unsub;
    api.query[pallet]
      .claimant(address, (rawOptional) => {
        if (rawOptional.isNone) {
          return;
        }

        const json = rawOptional.unwrap().toJSON();
        setClaimant(json);
      })
      .then((result) => (unsub = result))
      .finally(() => setLoading(false));

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [address, api, pallet]);

  return { isLoading: loading, claimant };
}
