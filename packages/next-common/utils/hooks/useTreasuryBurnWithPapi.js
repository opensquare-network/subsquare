import { useEffect, useState } from "react";
import { useMountedState } from "react-use";
import BigNumber from "bignumber.js";
import { useTreasuryPapiPallet } from "next-common/context/treasury";

export default function useTreasuryBurnWithPapi(papi, free) {
  const [burn, setBurn] = useState("0");
  const isMounted = useMountedState();
  const pallet = useTreasuryPapiPallet();

  useEffect(() => {
    if (papi && papi?.constants?.[pallet] && isMounted()) {
      papi.constants[pallet].Burn().then((burn) => {
        const toBurn = new BigNumber(burn)
          .dividedBy(Math.pow(10, 6))
          .multipliedBy(free)
          .toString();
        setBurn(toBurn);
      });
    }
  }, [papi, free, isMounted, pallet]);

  return burn;
}
