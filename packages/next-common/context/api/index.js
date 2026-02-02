import { createContext, useContext, useEffect, useState } from "react";
import { useChain, useChainSettings } from "next-common/context/chain";
import { currentNodeSelector } from "next-common/store/reducers/nodeSlice";
import { useDispatch, useSelector } from "react-redux";
import { getOriginApi } from "next-common/services/chain/api";
import { useMountedState } from "react-use";

export const ApiContext = createContext(null);

export default function ApiProvider({ children }) {
  const chain = useChain();
  const currentEndpoint = useSelector(currentNodeSelector);
  const dispatch = useDispatch();
  const { endpoints } = useChainSettings();
  const [nowApi, setNowApi] = useState(null);
  const isMounted = useMountedState();

  useEffect(() => {
    if (!currentEndpoint) {
      return;
    }

    getOriginApi(chain, currentEndpoint)
      .then((api) => {
        if (isMounted()) {
          setNowApi(api);
        }
      })
      .catch((error) => {
        console.error("Failed to getOriginApi", {
          chain,
          currentEndpoint,
          error,
        });
      });
  }, [currentEndpoint, dispatch, endpoints, chain, isMounted]);

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
