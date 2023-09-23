import useApi from "next-common/utils/hooks/useApi";
import { useEffect, useState } from "react";

export default function useUndecidingTimeout() {
  const api = useApi();
  const [timout, setTimeout] = useState();

  useEffect(() => {
    if (api?.consts?.referenda) {
      setTimeout(api.consts.referenda.undecidingTimeout.toNumber());
    }
  }, [api]);

  return timout;
}
