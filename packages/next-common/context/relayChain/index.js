import {
  RelayChainProvider as RelayChainNameProvider,
  useRelayChain,
} from "./chain";
import { RelayChainApiProvider, useRelayChainApi } from "./api";

export function RelayChainProvider({ children }) {
  return (
    <RelayChainNameProvider>
      <RelayChainApiProvider>{children}</RelayChainApiProvider>
    </RelayChainNameProvider>
  );
}

export { useRelayChainApi, useRelayChain };
