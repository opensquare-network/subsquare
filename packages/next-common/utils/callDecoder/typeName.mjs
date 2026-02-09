function getPathBasedTypeName(metadata, typeId) {
  // try path-based naming
  if (typeId === undefined || typeId === null) {
    return null;
  }
  const rawLookup = metadata?.lookup?.[typeId];
  if (!rawLookup || !rawLookup.path || rawLookup.path.length === 0) {
    return null;
  }

  const path = rawLookup.path;
  const lastSegment = path[path.length - 1];

  // Recognize Call types: if last segment is "Call" or ends with "Call"
  // (like "RuntimeCall"), and it's the runtime's main Call enum, simplify to "Call"
  if (lastSegment === "Call" || lastSegment === "RuntimeCall") {
    // Check if this is a variant enum (the runtime Call type)
    if (rawLookup.def?.tag === "variant") {
      return "Call";
    }
  }

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

// Get a readable type name from lookup entry and metadata
export function getTypeName(lookupEntry, metadata, typeId) {
  if (!lookupEntry) return "Unknown";

  const { type } = lookupEntry;

  // For generic container types (sequence, option, result, compact, array, tuple),
  // always construct the generic format instead of using path-based names
  // This ensures we get "Option<T>" instead of just "Option"
  if (type === "sequence") {
    const innerType = getTypeName(
      lookupEntry.value,
      metadata,
      lookupEntry.value.id,
    );
    // Special case: Vec<u8> can be represented as "bytes" in some contexts
    if (innerType === "u8") {
      return "bytes";
    }
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
    // Compact types have a 'size' field indicating the inner primitive type
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

  // For non-generic types, check if there's a named type alias in metadata
  // This ensures we use custom type names like "XcmDoubleEncoded"
  // instead of generic ones like "Vec<u8>" for wrapped types
  const pathBasedName = getPathBasedTypeName(metadata, typeId);
  if (pathBasedName) {
    return pathBasedName;
  }

  // primitives / others
  if (type === "primitive") return lookupEntry.value;
  if (type === "void") return "()";
  // if (type === "bitSequence") return "BitSequence";
  // if (type === "AccountId32") return "AccountId32";
  // if (type === "AccountId20") return "AccountId20";

  return type;
}

export function normalizeOriginalTypeName(originalTypeName) {
  if (!originalTypeName) {
    return null;
  }
  if ([/^BalanceOf<.*>$/].some((regex) => regex.test(originalTypeName))) {
    return "BalanceOf";
  }
  return null;
}

export default { getTypeName };
