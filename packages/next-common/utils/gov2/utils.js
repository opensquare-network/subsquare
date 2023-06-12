export function extractAddressAndTrackId(storageKey = []) {
  const address = storageKey.args[0].toString();
  const trackId = storageKey.args[1].toNumber();

  return {
    address,
    trackId,
  };
}
