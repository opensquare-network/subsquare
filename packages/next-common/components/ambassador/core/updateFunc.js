import { useCallback } from "react";
import getChainSettings from "next-common/utils/consts/settings";
import { defaultBlockTime } from "next-common/utils/constants";
import { sleep } from "next-common/utils";
import { useDispatch } from "react-redux";
import { incAmbassadorCoreMembersTrigger } from "next-common/store/reducers/ambassador/core";

export default function useAmbassadorMembersUpdateFunc() {
  const dispatch = useDispatch();

  return useCallback(async () => {
    const blockTime =
      getChainSettings(process.env.NEXT_PUBLIC_CHAIN).blockTime ||
      defaultBlockTime;

    const timers = [1, 2];
    // eslint-disable-next-line no-unused-vars
    for (const timer of timers) {
      dispatch(incAmbassadorCoreMembersTrigger());
      await sleep(blockTime);
    }
  }, [dispatch]);
}
