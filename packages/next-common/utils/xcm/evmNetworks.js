// EVM network data and lookup logic adapted from:
// https://github.com/kheopswap/kheopswap/blob/main/web/src/registry/evmNetworks/evmNetworks.json
// https://github.com/kheopswap/kheopswap/blob/main/web/src/registry/evmNetworks/evmNetworks.ts
// Attribution is kept here because `evmNetworks.json` must remain valid JSON.
import evmNetworks from "./evmNetworks.json";

export function getEvmNetworkName(id) {
  const network = evmNetworks.find((item) => item.id === Number(id));

  return network?.name || `EVM network ${id}`;
}
