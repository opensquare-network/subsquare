import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { createClient } from "polkadot-api";
import { getWsProvider } from "polkadot-api/ws-provider";
import { currentNodeSelector } from "next-common/store/reducers/nodeSlice";
import { useSelector } from "react-redux";
import {
  getMetadata as getCachedMetadata,
  setMetadata,
} from "next-common/utils/papiMetadataCache";
import {
  metadata as metadataCodec,
  unifyMetadata,
} from "@polkadot-api/substrate-bindings";

const getPapi = async (currentEndpoint) => {
  const wsProvider = getWsProvider(currentEndpoint);
  const client = await createClient(wsProvider, {
    getMetadata: getCachedMetadata,
    setMetadata,
  });
  const api = client.getUnsafeApi();
  const metadataRaw = await client._request("state_getMetadata", []);
  const metadata = unifyMetadata(metadataCodec.dec(metadataRaw));
  const pallets = metadata?.pallets ?? [];
  return {
    api,
    client,
    pallets,
  };
};

const PapiContext = createContext(null);

export function PapiProvider({ children }) {
  const currentEndpoint = useSelector(currentNodeSelector);
  const [api, setApi] = useState(null);
  const [client, setClient] = useState(null);
  const [pallets, setPallets] = useState([]);

  useEffect(() => {
    if (!currentEndpoint) {
      return;
    }
    getPapi(currentEndpoint).then(({ api, client, pallets }) => {
      setApi(api);
      setClient(client);
      setPallets(pallets);
    });
  }, [currentEndpoint]);

  useEffect(() => {
    return () => {
      if (client) {
        client?.destroy?.();
      }
    };
  }, [client]);

  return (
    <PapiContext.Provider value={{ api, client, pallets }}>
      {children}
    </PapiContext.Provider>
  );
}

export function useContextPapiApi() {
  const { api } = useContext(PapiContext);
  return api;
}

export function useContextPapi() {
  const { api, client, pallets } = useContext(PapiContext);

  const checkPallet = useCallback(
    (palletName, storageName) => {
      if (!palletName) {
        return false;
      }

      const pallet = pallets?.find((item) => item.name === palletName);

      if (!pallet) {
        return false;
      }

      if (!storageName) {
        return true;
      }

      return !!pallet?.storage?.items?.some(
        (item) => item.name === storageName,
      );
    },
    [pallets],
  );

  return { api, client, checkPallet };
}

export default PapiContext;
