import getChainSettings from "next-common/utils/consts/settings";
import { defaultBlockTime } from "next-common/utils/constants";
import { sleep } from "next-common/utils";
import { fetchMyProxies } from "next-common/store/reducers/myProxiesSlice";

export default async function updateMyproxies(dispatch, address, api) {
  const blockTime =
    getChainSettings(process.env.NEXT_PUBLIC_CHAIN).blockTime ||
    defaultBlockTime;

  for (let i = 0; i < 10; i++) {
    dispatch(fetchMyProxies(address, api));
    await sleep(blockTime);
  }
}
