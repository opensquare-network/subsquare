import { useEffect, useState } from "react";
import { useMountedState } from "react-use";
import BigNumber from "bignumber.js";
import { useTreasuryPallet } from "next-common/context/treasury";

export default function useTreasuryBurn(api, free) {
  const [burn, setBurn] = useState("0");
  const isMounted = useMountedState();
  const pallet = useTreasuryPallet();

  useEffect(() => {
    if (api && api.consts[pallet] && isMounted()) {
      const burn = api.consts.treasury.burn;
      const toBurn = new BigNumber(burn.toNumber())
        .dividedBy(Math.pow(10, 6))
        .multipliedBy(free)
        .toString();
      setBurn(toBurn);
    }
  }, [api, free]);

  return burn;
}
