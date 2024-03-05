import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";

export default function useFellowshipUndecidingTimeout() {
  const api = useContextApi();
  const [timout, setTimeout] = useState();

  useEffect(() => {
    if (api?.consts?.fellowshipReferenda) {
      setTimeout(api.consts.fellowshipReferenda.undecidingTimeout.toNumber());
    }
  }, [api]);

  return timout;
}
