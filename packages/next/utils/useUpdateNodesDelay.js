import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { typesBundleForPolkadot } from "@acala-network/type-definitions";

import {
  currentNodeSelector,
  nodesSelector,
  setNodesDelay,
} from "../store/reducers/nodeSlice";
import { sleep } from "./index";

const apiInstanceMap = new Map();

const getApi = async (chain, queryUrl) => {
  if (!apiInstanceMap.has(queryUrl)) {
    const provider = new WsProvider(queryUrl, 1000);
    const options = { provider };
    if (chain === "karura") {
      options.typesBundle = { ...typesBundleForPolkadot };
    }

    apiInstanceMap.set(queryUrl, ApiPromise.create(options));
  }
  return apiInstanceMap.get(queryUrl);
};

const TIMEOUT = 10000;
let count = 0;

const fetchApiTime = async (api) => {
  const startTime = Date.now();
  try {
    await api.rpc.system.chain();
  } catch (e) {
    return "error";
  }

  const endTime = Date.now();
  return endTime - startTime;
};

const timeout = async (ms) => {
  await sleep(ms);
  return "timeout";
};

const testNet = async (api) => {
  return await Promise.race([fetchApiTime(api), timeout(TIMEOUT)]);
};

const updateNodeDelay = async (chain, url) => {
  try {
    const api = await getApi(chain, url);
    return await testNet(api);
  } catch (e) {
    console.error("we have a error to test network", e);
    return "timeout";
  }
};

const useUpdateNodesDelay = () => {
  const router = useRouter();
  const nodesSetting = useSelector(nodesSelector);
  const { chain } = router.query;
  const currentNode = useSelector(currentNodeSelector);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!chain) {
      return;
    }

    const intervalId = setInterval(async () => {
      const updateNodes = (nodesSetting[chain] || []).filter(
        (item) => item.url === currentNode?.[chain] || item.update
      );

      if (updateNodes && updateNodes.length > 0) {
        const updateNode = updateNodes[count % updateNodes.length];
        const delay = await updateNodeDelay(chain, updateNode.url);
        dispatch(setNodesDelay([{ chain, url: updateNode.url, delay }]));
      }

      count++;
    }, 5000);

    return () => clearInterval(intervalId);
  }, [dispatch, nodesSetting, chain, currentNode]);
};

export default useUpdateNodesDelay;
