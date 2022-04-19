import { useEffect, useState } from "react";
import { useIsMountedBool } from "./useIsMounted";
import BN from "bn.js";

export default function useTreasuryBurn(api, free) {
  const [burn, setBurn] = useState("0");
  const isMounted = useIsMountedBool();

  useEffect(() => {
    if (!api) {
      return;
    }

    const burn = api.consts.treasury.burn;
    const toBurn = burn.mul(new BN(free));
    if (isMounted()) {
      setBurn(toBurn.toString());
    }
  }, [api, free]);

  return burn;
}
