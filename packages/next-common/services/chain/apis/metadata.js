import localForage from "localforage";
import safeLocalStorage from "next-common/utils/safeLocalStorage";

localForage.config({
  name: "subsquare",
  version: 1.0,
});

export default async function getMetadata(provider) {
  await provider.isReady;
  const [genesisHash, runtimeVersion] = await Promise.all([
    provider.send("chain_getBlockHash", [0]),
    provider.send("state_getRuntimeVersion", []),
  ]);

  const id = `${genesisHash}-${runtimeVersion.specVersion}`;
  let metadata = await localForage.getItem(id);
  if (!metadata) {
    // We stored metadata to localstorage in the 1st version. This code branch can be removed after some time.
    const metadataFromLocalStorage = safeLocalStorage.getItem(id);
    if (metadataFromLocalStorage) {
      metadata = metadataFromLocalStorage;
      await localForage.setItem(id, metadataFromLocalStorage);
    }
  }

  if (!metadata) {
    metadata = await provider.send("state_getMetadata", []);
    try {
      await localForage.setItem(id, metadata);
    } catch (e) {
      console.error(e);
    }
  }

  return {
    id,
    metadata,
  };
}
