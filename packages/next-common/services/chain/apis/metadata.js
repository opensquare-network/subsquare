export default async function getMetadata(provider) {
  await provider.isReady;
  const [genesisHash, runtimeVersion] = await Promise.all([
    provider.send("chain_getBlockHash", [0]),
    provider.send("state_getRuntimeVersion", []),
  ]);

  const id = `${genesisHash}-${runtimeVersion.specVersion}`;
  let metadata = localStorage.getItem(id);
  if (!metadata) {
    metadata = await provider.send("state_getMetadata", []);
    try {
      localStorage.setItem(id, metadata);
    } catch (e) {
      // ignore and the metadata size may exceed localstorage quota
      // todo: use indexeddb to store metadata
    }
  }

  return {
    id,
    metadata,
  };
}
