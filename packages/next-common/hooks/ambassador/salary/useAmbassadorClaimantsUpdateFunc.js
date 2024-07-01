import { useChainSettings } from "next-common/context/chain";
import { incAmbassadorSalaryClaimantsTrigger } from "next-common/store/reducers/ambassador/claimants";
import { sleep } from "next-common/utils";
import { defaultBlockTime } from "next-common/utils/constants";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

export default function useAmbassadorClaimantsUpdateFunc() {
  const chainSettings = useChainSettings();
  const dispatch = useDispatch();

  return useCallback(async () => {
    const blockTime = chainSettings.blockTime || defaultBlockTime;

    const timers = [1, 2];
    // eslint-disable-next-line no-unused-vars
    for (const timer of timers) {
      dispatch(incAmbassadorSalaryClaimantsTrigger());
      await sleep(blockTime);
    }
  }, [dispatch, chainSettings]);
}
