import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";
import { useCollectivesContext } from "next-common/context/collectives/collectives";

export default function useMySalaryClaimant() {
  const address = useRealAddress();
  const api = useContextApi();
  const [claimant, setClaimant] = useState(null);
  const [loading, setLoading] = useState(true);
  const { section } = useCollectivesContext();

  useEffect(() => {
    let pallet;
    if (section === "fellowship") {
      pallet = api?.query?.fellowshipSalary;
    } else if (section === "ambassador") {
      pallet = api?.query?.ambassadorSalary;
    }

    if (!address || !pallet) {
      setLoading(false);
      return;
    }

    let unsub;
    pallet
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
  }, [address, api, section]);

  return { isLoading: loading, claimant };
}
