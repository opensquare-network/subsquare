import { useDispatch } from "react-redux";
import { setNodesDelay } from "../../store/reducers/nodeSlice";
import { sleep } from "../index";
import { getApiProviderMap } from "next-common/services/chain/apis/providers";
import { useInterval } from "react-use";

const TIMEOUT = 10000;
let count = 0;

async function getRpcTime(provider) {
  const startTime = Date.now();
  try {
    await provider.send("system_chain", []);
  } catch {
    return "error";
  }

  const endTime = Date.now();
  return endTime - startTime;
}

async function timeout(ms) {
  await sleep(ms);
  return "timeout";
}

const testNet = async (provider) => {
  return await Promise.race([getRpcTime(provider), timeout(TIMEOUT)]);
};

async function getNodeDelay(provider) {
  try {
    return await testNet(provider);
  } catch (e) {
    console.error("we have a error to test network", e);
    return "timeout";
  }
}

async function updateUrlDelay(url, dispatch) {
  const providerMap = getApiProviderMap();
  const provider = await providerMap[url];
  const delay = await getNodeDelay(provider);
  dispatch(setNodesDelay([{ url, delay }]));
}

function useUpdateNodesDelay() {
  const dispatch = useDispatch();

  useInterval(async () => {
    const providerMap = getApiProviderMap();
    const endpoints = Object.keys(providerMap);
    if (count++ === 0) {
      // update delay for all endpoints at the first time
      await Promise.all(endpoints.map((url) => updateUrlDelay(url, dispatch)));
    } else if (endpoints && endpoints.length > 0) {
      const url = endpoints[count % endpoints.length];
      const provider = await providerMap[url];
      const delay = await getNodeDelay(provider);
      dispatch(setNodesDelay([{ url, delay }]));
    }
  }, 6000);
}

export default useUpdateNodesDelay;
