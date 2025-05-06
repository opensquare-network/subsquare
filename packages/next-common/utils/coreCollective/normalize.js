export function normalizeCoreCollectiveEntries(coreEntries = []) {
  let members = [];
  for (const [storageKey, record] of coreEntries) {
    const address = storageKey.args[0].toString();
    if (!record.isSome) {
      continue;
    }
    const memberStatus = record.toJSON();
    members.push({ address, status: memberStatus });
  }

  return members;
}
