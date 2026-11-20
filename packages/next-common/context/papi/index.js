import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { currentNodeSelector } from "next-common/store/reducers/nodeSlice";
import { useSelector } from "react-redux";
import { getPapiWithPallets } from "next-common/services/chain/papi";
import { createCheckPallet } from "next-common/utils/papi/checkPallet";
import BlockPapi from "next-common/utils/papiUtils/blockPapi.mjs";

const PapiContext = createContext(null);

export function PapiProvider({ children, blockHash = null }) {
  const currentEndpoint = useSelector(currentNodeSelector);
  const [rawApi, setRawApi] = useState(null);
  const [client, setClient] = useState(null);
  const [pallets, setPallets] = useState([]);

  useEffect(() => {
    if (!currentEndpoint) {
      return;
    }

    let cancelled = false;
    getPapiWithPallets(currentEndpoint)
      .then(({ api, client, pallets }) => {
        if (cancelled) {
          return;
        }
        setRawApi(api);
        setClient(client);
        setPallets(pallets);
      })
      .catch((error) => {
        console.error("Failed to connect chain PAPI:", error);
      });

    return () => {
      cancelled = true;
    };
  }, [currentEndpoint]);

  useEffect(() => {
    return () => {
      if (client) {
        client?.destroy?.();
      }
    };
  }, [client]);

  const api = useMemo(() => {
    if (!rawApi) return null;
    if (!blockHash) return rawApi;
    return new BlockPapi(rawApi, blockHash);
  }, [rawApi, blockHash]);

  return (
    <PapiContext.Provider value={{ api, client, pallets, blockHash }}>
      {children}
    </PapiContext.Provider>
  );
}

export function useContextPapiApi() {
  const context = useContext(PapiContext);
  return context?.api;
}

export function useContextPapi() {
  const context = useContext(PapiContext);

  const checkPallet = useMemo(
    () => createCheckPallet(context?.pallets),
    [context?.pallets],
  );

  return {
    api: context?.api,
    client: context?.client,
    blockHash: context?.blockHash,
    checkPallet,
  };
}

export default PapiContext;
