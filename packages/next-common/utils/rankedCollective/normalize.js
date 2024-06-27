export function normalizeRankedCollectiveEntries(collectiveEntries = []) {
  let members = [];
  for (const [storageKey, record] of collectiveEntries) {
    const address = storageKey.args[0].toString();
    if (!record.isSome) {
      continue;
    }
    const rank = record.unwrap().rank.toNumber();
    members.push({ address, rank });
  }

  return members;
}
