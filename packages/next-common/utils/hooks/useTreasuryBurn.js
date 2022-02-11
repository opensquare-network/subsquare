import { useEffect, useState } from "react";
import useIsMounted from "./useIsMounted";
import BN from "bn.js";

export default function useTreasuryBurn(api, free) {
  const [burn, setBurn] = useState("0");
  const isMounted = useIsMounted();

  useEffect(() => {
    if (!api) {
      return;
    }

    const burn = api.consts.treasury.burn;
    const toBurn = burn.mul(new BN(free));
    if (isMounted.current) {
      setBurn(toBurn.toString());
    }
  }, [api, free]);

  return burn;
}
