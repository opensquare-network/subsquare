// Pure decision helpers for the "extension metadata is outdated" prompt. They are kept
// free of React and polkadot-api dependencies so the logic can be replayed against real
// chain data, see scripts/verify-metadata-update-logic.mjs.
//
// The extension reports the metadata it currently holds as
// [{ genesisHash, specVersion }, ...] (see @polkadot/extension-inject InjectedMetadata).
// The prompt is only needed when that snapshot is missing or older than the chain.

export function findExtensionMetadata(known, isSameGenesis) {
  if (!Array.isArray(known)) {
    return null;
  }

  return known.find(({ genesisHash }) => isSameGenesis(genesisHash)) || null;
}

export function isMetadataStored(known, isSameGenesis, specVersion) {
  const entry = findExtensionMetadata(known, isSameGenesis);
  return Boolean(entry) && Number(entry.specVersion) >= specVersion;
}

// A wallet can resolve metadata.provide() without persisting anything (its storage may be
// full), and the injected API only exposes the in-memory copy, so a lost entry is usually
// noticed on the next browser session. Retry the same chain version once a day instead of
// asking again on every popup; a real runtime upgrade bumps the version and passes through.
export const PROVIDE_RETRY_INTERVAL = 24 * 60 * 60 * 1000;

export function isProvideRecent(
  record,
  onchainSpecVersion,
  now = Date.now(),
  interval = PROVIDE_RETRY_INTERVAL,
) {
  if (!record) {
    return false;
  }

  return record.specVersion >= onchainSpecVersion && now - record.at < interval;
}

export function needMetadataUpdate({
  hasExtensionMetadata,
  extensionSpecVersion,
  onchainSpecVersion,
  propertiesChanged = false,
}) {
  if (propertiesChanged) {
    return true;
  }

  const stored = Number(extensionSpecVersion);
  if (!hasExtensionMetadata || !Number.isFinite(stored)) {
    return true;
  }

  return onchainSpecVersion > stored;
}
