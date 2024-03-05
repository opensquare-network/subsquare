import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";

export default function useLaunchPeriod() {
  const api = useContextApi();
  const [period, setPeriod] = useState();

  useEffect(() => {
    if (!api || !api.consts.democracy?.launchPeriod) {
      return;
    }

    setPeriod(api.consts.democracy.launchPeriod.toNumber());
  }, [api]);

  return period;
}
