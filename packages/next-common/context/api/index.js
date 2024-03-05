import { createContext, useContext, useEffect, useState } from "react";
import { useChain, useChainSettings } from "next-common/context/chain";
import {
  currentNodeSelector,
  removeCurrentNode,
  setCurrentNode,
} from "next-common/store/reducers/nodeSlice";
import { useDispatch, useSelector } from "react-redux";
import useCandidateNodes from "next-common/services/chain/apis/useCandidateNodes";
import getApiInSeconds, { getApi } from "next-common/services/chain/api";

const ApiContext = createContext(null);

let latestApi;

export default function ApiProvider({ children }) {
  const chain = useChain();
  const currentEndpoint = useSelector(currentNodeSelector);
  const dispatch = useDispatch();
  const { endpoints } = useChainSettings();
  const candidateNodes = useCandidateNodes();
  const [nowApi, setNowApi] = useState(null);

  useEffect(() => {
    if (
      nowApi &&
      currentEndpoint &&
      nowApi?._options.provider.endpoint === currentEndpoint
    ) {
      return;
    }

    if (currentEndpoint) {
      getApiInSeconds(chain, currentEndpoint)
        .then((api) => {
          setNowApi(api);
          latestApi = api;
        })
        .catch(() => {
          if (endpoints.length > 1) {
            dispatch(removeCurrentNode()); // remove current node to trigger the best node selection
          }
        });
    } else {
      Promise.any(
        candidateNodes.map((endpoint) => getApi(chain, endpoint)),
      ).then((api) => {
        setNowApi(api);
        latestApi = api;
        const endpoint = api._options.provider.endpoint;
        dispatch(setCurrentNode({ url: endpoint, saveLocalStorage: false }));
      });
    }
  }, [currentEndpoint, chain, dispatch, endpoints, candidateNodes]);

  return <ApiContext.Provider value={nowApi}>{children}</ApiContext.Provider>;
}

export function useContextApi() {
  return useContext(ApiContext);
}

export function getLatestApi() {
  if (!latestApi) {
    throw new Error("Use getLastApi after api initialized");
  }

  return latestApi;
}
