import useApi from "next-common/utils/hooks/useApi";
import { useEffect, useState } from "react";

export default function useFellowshipUndecidingTimeout() {
  const api = useApi();
  const [timout, setTimeout] = useState();

  useEffect(() => {
    if (api?.consts?.fellowshipReferenda) {
      setTimeout(api.consts.fellowshipReferenda.undecidingTimeout.toNumber());
    }
  }, [api]);

  return timout;
}
