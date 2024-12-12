import {
  fetchMyMultisigs,
  fetchMyMultisigsCount,
} from "next-common/store/reducers/multisigSlice";
import getChainSettings from "next-common/utils/consts/settings";
import { defaultBlockTime } from "next-common/utils/constants";
import { sleep } from "next-common/utils";

async function fetchDataMultipleTimes(
  dispatch,
  actionCreator,
  chain,
  address,
  page = null,
  times = 10,
) {
  const blockTime =
    getChainSettings(process.env.NEXT_PUBLIC_CHAIN).blockTime ||
    defaultBlockTime;

  for (let i = 0; i < times; i++) {
    dispatch(actionCreator(chain, address, page));
    await sleep(blockTime);
  }
}

export async function fetchMultisigList10Times(dispatch, chain, address, page) {
  await fetchDataMultipleTimes(
    dispatch,
    fetchMyMultisigs,
    chain,
    address,
    page,
  );
}

export async function fetchMultisigsCount10Times(dispatch, chain, address) {
  await fetchDataMultipleTimes(dispatch, fetchMyMultisigsCount, chain, address);
}
