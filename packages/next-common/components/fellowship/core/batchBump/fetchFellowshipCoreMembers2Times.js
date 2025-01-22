import getChainSettings from "next-common/utils/consts/settings";
import { defaultBlockTime } from "next-common/utils/constants";
import { sleep } from "next-common/utils";

async function fetchFellowshipCoreMembers2Times(fetch, times = 2) {
  const blockTime =
    getChainSettings(process.env.NEXT_PUBLIC_CHAIN).blockTime ||
    defaultBlockTime;

  for (let i = 0; i < times; i++) {
    await fetch();
    await sleep(blockTime);
  }
}

export default fetchFellowshipCoreMembers2Times;
