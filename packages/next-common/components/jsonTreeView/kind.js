// JSON itself has no BigInt, but decoded chain data carries them (e.g. XCM junction
// indexes), and they are shown as plain numbers.
export function getJsonKind(value) {
  if (value === null || value === undefined) {
    return "null";
  }
  if (Array.isArray(value)) {
    return "array";
  }
  if (typeof value === "bigint") {
    return "number";
  }

  return typeof value;
}

export function isContainerKind(kind) {
  return kind === "object" || kind === "array";
}

export function entriesOf(value) {
  if (Array.isArray(value)) {
    return value.map((item, index) => [`[${index}]`, item]);
  }

  return Object.entries(value);
}

// The text of a node rendered as a leaf, i.e. a scalar or an empty container.
export function formatLeaf(value) {
  if (value === null || value === undefined) {
    return "null";
  }
  if (typeof value === "bigint") {
    return value.toString();
  }
  if (typeof value === "object") {
    return Array.isArray(value) ? "[]" : "{}";
  }

  return String(value);
}

// "array[2]" for arrays, the kind itself for objects.
export function containerLabel(kind, length) {
  return kind === "array" ? `array[${length}]` : kind;
}
