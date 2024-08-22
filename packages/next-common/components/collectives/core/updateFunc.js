import { useCallback } from "react";
import getChainSettings from "next-common/utils/consts/settings";
import { defaultBlockTime } from "next-common/utils/constants";
import { sleep } from "next-common/utils";
import { useDispatch } from "react-redux";
import useFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFellowshipCoreMembers";

export default function useCoreFellowshipUpdateFunc() {
  const dispatch = useDispatch();
  const { fetch } = useFellowshipCoreMembers();

  return useCallback(async () => {
    const blockTime =
      getChainSettings(process.env.NEXT_PUBLIC_CHAIN).blockTime ||
      defaultBlockTime;

    const timers = [1, 2];
    // eslint-disable-next-line no-unused-vars
    for (const timer of timers) {
      await fetch();
      await sleep(blockTime);
    }
  }, [dispatch, fetch]);
}
