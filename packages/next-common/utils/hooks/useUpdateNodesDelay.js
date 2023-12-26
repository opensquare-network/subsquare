import { useEffect } from "react";
import { useDispatch } from "react-redux";
import getApi from "../../services/chain/api";
import { setNodesDelay } from "../../store/reducers/nodeSlice";
import { sleep } from "../index";
import { useChain } from "../../context/chain";
import { getApiMap } from "next-common/services/chain/apis/new";

const TIMEOUT = 10000;
let count = 0;

async function fetchApiTime(api) {
  const startTime = Date.now();
  try {
    await api.rpc.system.chain();
  } catch (e) {
    return "error";
  }

  const endTime = Date.now();
  return endTime - startTime;
}

async function timeout(ms) {
  await sleep(ms);
  return "timeout";
}

const testNet = async (api) => {
  return await Promise.race([fetchApiTime(api), timeout(TIMEOUT)]);
};

async function updateNodeDelay(chain, url) {
  try {
    const api = await getApi(chain, url);
    return await testNet(api);
  } catch (e) {
    console.error("we have a error to test network", e);
    return "timeout";
  }
}

function useUpdateNodesDelay() {
  const chain = useChain();
  const dispatch = useDispatch();
  const apiMap = getApiMap();

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const endpointUrls = [...apiMap.keys()];

      if (endpointUrls && endpointUrls.length > 0) {
        const url = endpointUrls[count % endpointUrls.length];
        const delay = await updateNodeDelay(chain, url);
        dispatch(setNodesDelay([{ url, delay }]));
      }

      count++;
    }, 5000);

    return () => clearInterval(intervalId);
  }, [apiMap, dispatch, chain]);
}

export default useUpdateNodesDelay;
