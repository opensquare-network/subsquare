import { useCallback } from "react";
import getChainSettings from "next-common/utils/consts/settings";
import { defaultBlockTime } from "next-common/utils/constants";
import { incFellowshipCoreMembersTrigger } from "next-common/store/reducers/fellowship/core";
import { sleep } from "next-common/utils";
import { useDispatch } from "react-redux";
import { useCollectivesContext } from "next-common/context/collectives/collectives";
import { incAmbassadorCoreMembersTrigger } from "next-common/store/reducers/ambassador/core";

export default function useCoreFellowshipUpdateFunc() {
  const dispatch = useDispatch();
  const section = useCollectivesContext();

  return useCallback(async () => {
    const blockTime =
      getChainSettings(process.env.NEXT_PUBLIC_CHAIN).blockTime ||
      defaultBlockTime;

    const timers = [1, 2];
    // eslint-disable-next-line no-unused-vars
    for (const timer of timers) {
      if ("fellowship" === section) {
        dispatch(incFellowshipCoreMembersTrigger());
      } else if ("ambassador" === section) {
        dispatch(incAmbassadorCoreMembersTrigger());
      }
      await sleep(blockTime);
    }
  }, [dispatch]);
}
