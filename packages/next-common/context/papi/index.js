import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "polkadot-api";
import { getWsProvider } from "polkadot-api/ws-provider";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";

const getPapi = async () => {
  const settings = getChainSettings(CHAIN);
  const endpoints = settings.endpoints.map((item) => item.url);
  const wsProvider = getWsProvider(endpoints);
  const client = await createClient(wsProvider);
  const api = client.getUnsafeApi();
  return {
    api,
    client,
  };
};

const PapiContext = createContext(null);

export function PapiProvider({ children }) {
  const [api, setApi] = useState(null);
  const [client, setClient] = useState(null);

  useEffect(() => {
    getPapi().then(({ api, client }) => {
      setApi(api);
      setClient(client);
    });
  }, []);

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
