import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setNodesDelay } from "../../store/reducers/nodeSlice";
import { sleep } from "../index";
import { useChain } from "../../context/chain";
import { getApiMap } from "next-common/services/chain/apis/new";
import useCandidateNodes from "next-common/services/chain/apis/useCandidateNodes";

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

async function getNodeDelay(api) {
  try {
    return await testNet(api);
  } catch (e) {
    console.error("we have a error to test network", e);
    return "timeout";
  }
}

async function updateUrlDelay(url, dispatch) {
  const apiMap = getApiMap();
  const api = await apiMap.get(url);
  const delay = await getNodeDelay(api);
  dispatch(setNodesDelay([{ url, delay }]));
}

function useUpdateNodesDelay() {
  const chain = useChain();
  const dispatch = useDispatch();
  const candidateNodes = useCandidateNodes();

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const apiMap = getApiMap();
      if (count++ === 0) {
        // update delay for all endpoints at the first time
        await Promise.all(
          candidateNodes.map((url) => updateUrlDelay(url, dispatch)),
        );
      } else if (candidateNodes && candidateNodes.length > 0) {
        const url = candidateNodes[count % candidateNodes.length];
        const api = await apiMap.get(url);
        const delay = await getNodeDelay(api);
        dispatch(setNodesDelay([{ url, delay }]));
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [dispatch, chain, candidateNodes]);
}

export default useUpdateNodesDelay;
