import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useChain, useChainSettings } from "next-common/context/chain";
import {
  currentNodeSelector,
  removeCurrentNode,
  setCurrentNode,
} from "next-common/store/reducers/nodeSlice";
import { useDispatch, useSelector } from "react-redux";
import useCandidateNodes from "next-common/services/chain/apis/useCandidateNodes";
import getApiInSeconds, { getApi } from "next-common/services/chain/api";

export const ApiContext = createContext(null);

export default function ApiProvider({ children }) {
  const chain = useChain();
  const currentEndpoint = useSelector(currentNodeSelector);
  const dispatch = useDispatch();
  const { endpoints } = useChainSettings();
  const candidateNodes = useCandidateNodes();
  const [nowApi, setNowApi] = useState(null);

  const disconnect = useCallback(
    async (api) => {
      try {
        const apiEndpoint = api?._options?.provider?.endpoint;
        await api?.disconnect();
        if (candidateNodes.includes(apiEndpoint)) {
          getApi(chain, apiEndpoint);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [candidateNodes, chain],
  );

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
          setNowApi((oldApi) => {
            disconnect(oldApi);
            return api;
          });
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
        setNowApi((oldApi) => {
          disconnect(oldApi);
          return api;
        });
        const endpoint = api._options.provider.endpoint;
        dispatch(setCurrentNode({ url: endpoint, saveLocalStorage: false }));
      });
    }
  }, [
    currentEndpoint,
    chain,
    dispatch,
    endpoints,
    candidateNodes,
    nowApi,
    disconnect,
  ]);

  return <ApiProviderWithApi api={nowApi}>{children}</ApiProviderWithApi>;
}

export function ApiProviderWithApi({ children, api }) {
  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
}

/**
 * @returns {import("@polkadot/api").ApiPromise}
 */
export function useContextApi() {
  return useContext(ApiContext);
}
