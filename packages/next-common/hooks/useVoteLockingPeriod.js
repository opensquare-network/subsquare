import { useEffect, useState } from "react";
import useApi from "next-common/utils/hooks/useApi";

export default function useVoteLockingPeriod(pallet) {
  const api = useApi();
  const [period, setPeriod] = useState();

  useEffect(() => {
    if (api) {
      setPeriod(api.consts?.[pallet]?.voteLockingPeriod.toNumber());
    }
  }, [api, pallet]);

  return period;
}
