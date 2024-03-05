import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";

export default function useVoteLockingPeriod(pallet) {
  const api = useContextApi();
  const [period, setPeriod] = useState();

  useEffect(() => {
    if (api) {
      setPeriod(api.consts?.[pallet]?.voteLockingPeriod.toNumber());
    }
  }, [api, pallet]);

  return period;
}
