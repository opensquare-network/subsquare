import { getMetadata } from "next-common/utils/callDecoder/decoder.mjs";

const metadataCache = new WeakMap();

export async function getCachedMetadata(client) {
  if (!client) {
    return null;
  }
  let promise = metadataCache.get(client);
  if (!promise) {
    promise = getMetadata(client).catch((err) => {
      metadataCache.delete(client);
      throw err;
    });
    metadataCache.set(client, promise);
  }
  return promise;
}
