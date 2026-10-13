import { useMemo } from "react";
import { createClient } from "polkadot-api";
import { getWsProvider } from "polkadot-api/ws";
import { useChainSettings } from "next-common/context/chain";
import { getMetadata, setMetadata } from "next-common/utils/papiMetadataCache";
import { getCachedMetadata } from "next-common/utils/papi/getCachedMetadata";

const metadataPromises = new Map();

async function fetchRelayChainMetadata(url) {
  const client = await createClient(getWsProvider(url), {
    getMetadata,
    setMetadata,
  });

  try {
    return await getCachedMetadata(client);
  } finally {
    client?.destroy?.();
  }
}

// Preimages of a chain that migrated to the asset hub can be calls of either
// chain, so both metadata are needed to decode them. The relay chain metadata
// does not depend on the preimage, so it is fetched once per endpoint and
// reused for the rest of the session.
export function getRelayChainMetadataPromise(url) {
  if (!url) {
    return null;
  }

  let promise = metadataPromises.get(url);
  if (!promise) {
    promise = fetchRelayChainMetadata(url).catch(() => null);
    metadataPromises.set(url, promise);
  }

  return promise;
}

export default function useRelayChainMetadata(enabled = true) {
  const { relayChainEndpoints } = useChainSettings();
  const url = enabled ? relayChainEndpoints?.[0]?.url : null;

  return useMemo(() => getRelayChainMetadataPromise(url), [url]);
}
