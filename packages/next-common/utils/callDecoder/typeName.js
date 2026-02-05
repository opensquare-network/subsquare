function getPathBasedTypeName(metadata, typeId) {
  if (typeId === undefined || typeId === null) {
    return null;
  }
  const rawLookup = metadata?.lookup?.[typeId];
  if (!rawLookup || !rawLookup.path || rawLookup.path.length === 0) {
    return null;
  }

  const path = rawLookup.path;
  if (path[path.length - 1] === "Call" && path.length > 1) {
    return "Call";
  }

  const lastSegment = path[path.length - 1];
  const lastLower = lastSegment.toLowerCase().replace(/[^a-z0-9]/g, "");
  const segs = [];
  for (let i = 0; i < path.length - 1; i++) {
    const s = path[i];
    const sl = s.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (i === path.length - 2 && sl === lastLower) continue;
    if (sl === "pallet") continue;
    const pascal = s
      .split("_")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
      .join("");
    segs.push(pascal);
  }
  segs.push(lastSegment);
  const full = segs.join("");
  if (full.length > 0 && full.length < 100) {
    return full;
  }

  return lastSegment;
}

export function getTypeName(lookupEntry, metadata, typeId) {
  if (!lookupEntry) return "Unknown";

  const { type } = lookupEntry;

  if (type === "sequence") {
    const innerType = getTypeName(
      lookupEntry.value,
      metadata,
      lookupEntry.value.id,
    );
    return `Vec<${innerType}>`;
  }

  if (type === "array") {
    if (
      lookupEntry.len === 32 &&
      lookupEntry.value.type === "primitive" &&
      lookupEntry.value.value === "u8"
    ) {
      return "H256";
    }
    const innerType = getTypeName(
      lookupEntry.value,
      metadata,
      lookupEntry.value.id,
    );
    return `[${innerType}; ${lookupEntry.len}]`;
  }

  if (type === "compact") {
    const innerType = lookupEntry.size || "Unknown";
    return `Compact<${innerType}>`;
  }

  if (type === "option") {
    const innerType = getTypeName(
      lookupEntry.value,
      metadata,
      lookupEntry.value.id,
    );
    return `Option<${innerType}>`;
  }

  if (type === "result") {
    const okType = getTypeName(
      lookupEntry.value.ok,
      metadata,
      lookupEntry.value.ok.id,
    );
    const koType = getTypeName(
      lookupEntry.value.ko,
      metadata,
      lookupEntry.value.ko.id,
    );
    return `Result<${okType}, ${koType}>`;
  }

  if (type === "tuple") {
    const types = lookupEntry.value
      .map((v) => getTypeName(v, metadata, v.id))
      .join(", ");
    return `(${types})`;
  }

  const pathBasedName = getPathBasedTypeName(metadata, typeId);
  if (pathBasedName) {
    return pathBasedName;
  }

  // primitives / others
  if (type === "primitive") return lookupEntry.value;
  if (type === "void") return "()";
  if (type === "bitSequence") return "BitSequence";
  if (type === "AccountId32") return "AccountId32";
  if (type === "AccountId20") return "AccountId20";

  return type;
}

export default { getTypeName };
