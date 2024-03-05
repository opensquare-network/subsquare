import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";

export default function useUndecidingTimeout() {
  const api = useContextApi();
  const [timout, setTimeout] = useState();

  useEffect(() => {
    if (api?.consts?.referenda) {
      setTimeout(api.consts.referenda.undecidingTimeout.toNumber());
    }
  }, [api]);

  return timout;
}
