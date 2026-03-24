export function createCombinedHashes(oldHashes = [], newHashes = []) {
  const hashes = newHashes.map((data) => ({
    data,
    method: "requestStatusFor",
  }));

  for (const item of oldHashes) {
    const [oldHash] = item;
    if (!newHashes.some(([newHash]) => newHash === oldHash)) {
      hashes.push({ data: item, method: "statusFor" });
    }
  }

  return hashes;
}
