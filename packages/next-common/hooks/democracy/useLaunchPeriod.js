import useApi from "next-common/utils/hooks/useApi";
import { useEffect, useState } from "react";

export default function useLaunchPeriod() {
  const api = useApi();
  const [period, setPeriod] = useState();

  useEffect(() => {
    if (!api || !api.consts.democracy?.launchPeriod) {
      return;
    }

    setPeriod(api.consts.democracy.launchPeriod.toNumber());
  }, [api]);

  return period;
}
