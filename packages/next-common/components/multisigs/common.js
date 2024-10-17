import { fetchMyMultisigs } from "next-common/store/reducers/multisigSlice";
import getChainSettings from "next-common/utils/consts/settings";
import { defaultBlockTime } from "next-common/utils/constants";
import { sleep } from "next-common/utils";

export async function fetchMultisigList10Times(dispatch, chain, address, page) {
  const blockTime =
    getChainSettings(process.env.NEXT_PUBLIC_CHAIN).blockTime ||
    defaultBlockTime;
  const timers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  // eslint-disable-next-line no-unused-vars
  for (const timer of timers) {
    dispatch(fetchMyMultisigs(chain, address, page));
    await sleep(blockTime);
  }
}
