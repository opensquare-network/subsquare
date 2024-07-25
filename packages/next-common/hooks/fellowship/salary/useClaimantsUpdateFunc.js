import { useChainSettings } from "next-common/context/chain";
import { useCollectivesContext } from "next-common/context/collectives/collectives";
import { incAmbassadorSalaryClaimantsTrigger } from "next-common/store/reducers/ambassador/claimants";
import { incFellowshipSalaryClaimantsTrigger } from "next-common/store/reducers/fellowship/claimants";
import { sleep } from "next-common/utils";
import { defaultBlockTime } from "next-common/utils/constants";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

export default function useClaimantsFellowshipUpdateFunc() {
  const dispatch = useDispatch();
  const section = useCollectivesContext();
  const { blockTime: settingBlockTime } = useChainSettings();

  return useCallback(async () => {
    const blockTime = settingBlockTime || defaultBlockTime;

    const timers = [1, 2];
    // eslint-disable-next-line no-unused-vars
    for (const timer of timers) {
      if (section === "fellowship") {
        dispatch(incFellowshipSalaryClaimantsTrigger());
      } else if (section === "ambassador") {
        dispatch(incAmbassadorSalaryClaimantsTrigger());
      }
      await sleep(blockTime);
    }
  }, [dispatch, settingBlockTime]);
}
