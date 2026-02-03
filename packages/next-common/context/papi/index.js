import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "polkadot-api";
import { getWsProvider } from "polkadot-api/ws-provider";
import { currentNodeSelector } from "next-common/store/reducers/nodeSlice";
import { useSelector } from "react-redux";

const getPapi = async (currentEndpoint) => {
  const wsProvider = getWsProvider(currentEndpoint);
  const client = await createClient(wsProvider);
  const api = client.getUnsafeApi();
  return {
    api,
    client,
  };
};

const PapiContext = createContext(null);

export function PapiProvider({ children }) {
  const currentEndpoint = useSelector(currentNodeSelector);
  const [api, setApi] = useState(null);
  const [client, setClient] = useState(null);

  useEffect(() => {
    if (!currentEndpoint) {
      return;
    }
    getPapi(currentEndpoint).then(({ api, client }) => {
      setApi(api);
      setClient(client);
    });
  }, [currentEndpoint]);

  useEffect(() => {
    return () => {
      if (api) {
        api.destroy?.();
      }
    };
  }, [api]);

  return (
    <PapiContext.Provider value={{ api, client }}>
      {children}
    </PapiContext.Provider>
  );
}

export function useContextPapiApi() {
  const { api } = useContext(PapiContext);
  return api;
}

export function useContextPapi() {
  const { api, client } = useContext(PapiContext);
  return { api, client };
}

export default PapiContext;
