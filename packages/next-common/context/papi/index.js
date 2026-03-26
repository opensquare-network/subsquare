import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { currentNodeSelector } from "next-common/store/reducers/nodeSlice";
import { useSelector } from "react-redux";
import { getPapiWithPallets } from "next-common/services/chain/papi";

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
    getPapiWithPallets(currentEndpoint).then(
      ({ api, client, pallets }) => {
        setApi(api);
        setClient(client);
        setPallets(pallets);
      },
    );
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
  const context = useContext(PapiContext);
  return context?.api;
}

export function useContextPapi() {
  const context = useContext(PapiContext);

  const checkPallet = useCallback(
    (palletName, storageName) => {
      if (!palletName) {
        return false;
      }

      const pallet = context?.pallets?.find((item) => item.name === palletName);

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
    [context?.pallets],
  );

  return { api: context?.api, client: context?.client, checkPallet };
}

export default PapiContext;
