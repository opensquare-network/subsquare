import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useChain, useChainSettings } from "next-common/context/chain";
import {
  currentNodeSelector,
  removeCurrentNode,
  setCurrentNode,
} from "next-common/store/reducers/nodeSlice";
import { useDispatch, useSelector } from "react-redux";
import useCandidateNodes from "next-common/services/chain/apis/useCandidateNodes";
import getOriginApiInSeconds from "next-common/services/chain/api";
import { useMountedState } from "react-use";

export const ApiContext = createContext(null);

export default function ApiProvider({ children }) {
  const chain = useChain();
  const currentEndpoint = useSelector(currentNodeSelector);
  const dispatch = useDispatch();
  const { endpoints } = useChainSettings();
  const candidateNodes = useCandidateNodes();
  const [nowApi, setNowApi] = useState(null);
  const isMounted = useMountedState();

  const selectedEndpoint = useMemo(() => {
    if (currentEndpoint) return currentEndpoint;
    if (candidateNodes.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * candidateNodes.length);
    return candidateNodes[randomIndex];
  }, [currentEndpoint, candidateNodes]);

  useEffect(() => {
    if (!selectedEndpoint) {
      return;
    }

    dispatch(
      setCurrentNode({ url: selectedEndpoint, saveLocalStorage: false }),
    );

    getOriginApiInSeconds(chain, selectedEndpoint)
      .then((api) => {
        if (isMounted()) {
          setNowApi(api);
        } else {
          if (api && api.disconnect) {
            api.disconnect();
          }
        }
      })
      .catch(() => {
        if (endpoints.length > 1) {
          dispatch(removeCurrentNode());
        }
      });
  }, [selectedEndpoint, dispatch, endpoints, chain, isMounted]);

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
