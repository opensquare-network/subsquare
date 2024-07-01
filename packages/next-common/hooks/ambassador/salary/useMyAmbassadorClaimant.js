import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";

export default function useMyAmbassadorSalaryClaimant() {
  const address = useRealAddress();
  const api = useContextApi();
  const [claimant, setClaimant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address || !api?.query?.ambassadorSalary?.claimant) {
      setLoading(false);
      return;
    }

    let unsub;
    api.query.ambassadorSalary
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
  }, [address, api]);

  return { isLoading: loading, claimant };
}
