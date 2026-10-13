import { useMemo } from "react";
import {
  metadata as metadataCodec,
  unifyMetadata,
} from "@polkadot-api/substrate-bindings";
import { useChainSettings } from "next-common/context/chain";

const METADATA_REQUEST_ID = 1;
const METADATA_TIMEOUT = 10 * 1000;

const metadataPromises = new Map();

// Only the metadata is needed from the relay chain, so it is requested over a
// plain socket. A polkadot-api client would keep a chain head subscription
// open, and closing it right away makes it fail while it is still unfollowing
// the chain.
function requestMetadata(url) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url);
    let timeout = null;
    let settled = false;

    const settle = (error, metadata) => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timeout);
      socket.close();

      if (error) {
        reject(error);
      } else {
        resolve(metadata);
      }
    };

    timeout = setTimeout(
      () => settle(new Error(`Requesting metadata from ${url} timed out`)),
      METADATA_TIMEOUT,
    );

    socket.onopen = () =>
      socket.send(
        JSON.stringify({
          jsonrpc: "2.0",
          id: METADATA_REQUEST_ID,
          method: "state_getMetadata",
          params: [],
        }),
      );

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.id !== METADATA_REQUEST_ID) {
        // Subscription notifications and other messages of the endpoint.
        return;
      }

      if (!message.result) {
        settle(new Error(message.error?.message || "No metadata in response"));
        return;
      }

      settle(null, message.result);
    };

    socket.onerror = () => settle(new Error(`Cannot connect to ${url}`));
    socket.onclose = () => settle(new Error(`Connection to ${url} closed`));
  });
}

async function fetchRelayChainMetadata(url) {
  const rawMetadata = await requestMetadata(url);
  return unifyMetadata(metadataCodec.dec(rawMetadata));
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
    promise = fetchRelayChainMetadata(url).catch((error) => {
      console.warn("Failed to load the relay chain metadata", error);
      return null;
    });
    metadataPromises.set(url, promise);
  }

  return promise;
}

export default function useRelayChainMetadata(enabled = true) {
  const { relayChainEndpoints } = useChainSettings();
  const url = enabled ? relayChainEndpoints?.[0]?.url : null;

  return useMemo(() => getRelayChainMetadataPromise(url), [url]);
}
