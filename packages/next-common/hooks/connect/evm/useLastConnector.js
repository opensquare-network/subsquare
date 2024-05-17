import { find } from "lodash-es";
import { CACHE_KEY } from "next-common/utils/constants";
import { useLocalStorage } from "react-use";
import { useConnectors } from "wagmi";

export function useLastConnector() {
  const connectors = useConnectors();
  const [lastConnectorID] = useLocalStorage(CACHE_KEY.lastEVMConnectorID);

  const lastConnector = find(connectors, { id: lastConnectorID });

  return lastConnector;
}
