import { useCallback } from "react";
import getChainSettings from "next-common/utils/consts/settings";
import { defaultBlockTime } from "next-common/utils/constants";
import { incFellowshipCoreMembersTrigger } from "next-common/store/reducers/fellowship/core";
import { sleep } from "next-common/utils";
import { useDispatch } from "react-redux";

export default function useFellowshipMembersUpdateFunc() {
  const dispatch = useDispatch();

  return useCallback(async () => {
    const blockTime =
      getChainSettings(process.env.NEXT_PUBLIC_CHAIN).blockTime ||
      defaultBlockTime;

    const timers = [1, 2];
    // eslint-disable-next-line no-unused-vars
    for (const timer of timers) {
      dispatch(incFellowshipCoreMembersTrigger());
      await sleep(blockTime);
    }
  }, [dispatch]);
}
