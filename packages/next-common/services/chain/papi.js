import { createClient } from "polkadot-api";
import { getWsProvider } from "polkadot-api/ws";
import {
  getMetadata as getCachedMetadata,
  setMetadata,
} from "next-common/utils/papiMetadataCache";
import {
  metadata as metadataCodec,
  unifyMetadata,
} from "@polkadot-api/substrate-bindings";

export async function getPapi(endpoint, options = {}) {
  const { blockHash = null } = options;

  const wsProvider = getWsProvider(endpoint);
  const client = await createClient(wsProvider, {
    getMetadata: getCachedMetadata,
    setMetadata,
    ...(blockHash && { at: blockHash }),
  });
  const api = client.getUnsafeApi();

  return {
    api,
    client,
  };
}

export async function getPapiWithPallets(endpoint, options = {}) {
  const { api, client } = await getPapi(endpoint, options);
  const metadataRaw = await client._request("state_getMetadata", []);
  const metadata = unifyMetadata(metadataCodec.dec(metadataRaw));
  const pallets = metadata?.pallets ?? [];

  return {
    api,
    client,
    pallets,
  };
}
