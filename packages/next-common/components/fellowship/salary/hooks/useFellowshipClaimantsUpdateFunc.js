import { useDispatch } from "react-redux";
import { useCallback } from "react";
import getChainSettings from "next-common/utils/consts/settings";
import { defaultBlockTime } from "next-common/utils/constants";
import { sleep } from "next-common/utils";
import { incFellowshipSalaryClaimantsTrigger } from "next-common/store/reducers/fellowship/claimants";

export default function useFellowshipClaimantsUpdateFunc() {
  const dispatch = useDispatch();

  return useCallback(async () => {
    const blockTime =
      getChainSettings(process.env.NEXT_PUBLIC_CHAIN).blockTime ||
      defaultBlockTime;

    const timers = [1, 2];
    // eslint-disable-next-line no-unused-vars
    for (const timer of timers) {
      dispatch(incFellowshipSalaryClaimantsTrigger());
      await sleep(blockTime);
    }
  }, [dispatch]);
}
