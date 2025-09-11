import { useChainSettings } from "next-common/context/chain";
import { sleep } from "next-common/utils";
import { defaultBlockTime } from "next-common/utils/constants";
import { useCallback } from "react";
import { useFellowshipSalaryClaimants } from "./useFellowshipSalaryClaimants";

export default function useClaimantsFellowshipUpdateFunc() {
  const { blockTime: settingBlockTime } = useChainSettings();
  const { fetch } = useFellowshipSalaryClaimants();

  return useCallback(async () => {
    const blockTime = settingBlockTime || defaultBlockTime;

    const timers = [1, 2];
    // eslint-disable-next-line no-unused-vars
    for (const timer of timers) {
      await fetch();
      await sleep(blockTime);
    }
  }, [settingBlockTime, fetch]);
}
