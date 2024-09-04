import { useEffect, useState } from "react";
import { useMountedState } from "react-use";
import BigNumber from "bignumber.js";

export default function useTreasuryBurn(api, free) {
  const [burn, setBurn] = useState("0");
  const isMounted = useMountedState();

  useEffect(() => {
    if (api && api.consts.treasury && isMounted()) {
      const burn = api.consts.treasury.burn;
      const toBurn = new BigNumber(burn.toNumber())
        .dividedBy(Math.pow(10, 6))
        .multipliedBy(free)
        .toString();
      setBurn(toBurn);
    }
  }, [api, free, isMounted]);

  return burn;
}
