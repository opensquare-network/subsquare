import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";

export default function useUndecidingTimeout(pallet = "referenda") {
  const api = useContextApi();
  const [timout, setTimeout] = useState();

  useEffect(() => {
    if (api?.consts[pallet]) {
      setTimeout(api.consts[pallet].undecidingTimeout.toNumber());
    }
  }, [api, pallet]);

  return timout;
}
