import { isNil } from "lodash-es";

function convertPapiNodeToTableValue(node) {
  if (!node) return null;
  const { type, rawType, value, section, method, children } = node;

  // Call node → recursively convert to nested call table
  if (type === "Call" && section && method) {
    return convertPapiCallTreeToTableView(node);
  }

  // Vec<Call> → array of call objects
  if (type === "Vec<Call>") {
    return (children || []).map(convertPapiNodeToTableValue);
  }

  // Bytes sequence → keep as hex string
  if (
    rawType === "sequence" &&
    (type === "bytes" || type === "Bytes" || type === "Vec<u8>")
  ) {
    return value?.toString() ?? null;
  }

  // Enum → show variant name; if variant carries data, wrap as { variantName: ... }
  if (rawType === "enum") {
    if (!children?.length && isNil(value)) {
      return "null";
    }
    if (!children?.length) {
      return value;
    }
    const variant = children[0];
    const variantName = variant?.name ?? null;
    if (
      variant?.rawType === "void" ||
      (!variant?.children?.length && isNil(variant?.value))
    ) {
      return { [variantName]: null };
    }
    return { [variantName]: convertPapiNodeToTableValue(variant) };
  }

  // Struct → named-field object
  if (rawType === "struct") {
    if (!children?.length) return null;
    const obj = {};
    for (const child of children) {
      const key = child.name ?? child.type ?? String(Object.keys(obj).length);
      obj[key] = convertPapiNodeToTableValue(child);
    }
    return obj;
  }

  // Sequence (Vec) → array
  if (rawType === "sequence") {
    if (!children?.length) return [];
    return children.map(convertPapiNodeToTableValue);
  }

  // Fixed-size array ([T; N]) → array
  if (rawType === "array") {
    if (!children?.length) return value ?? null;
    return children.map(convertPapiNodeToTableValue);
  }

  // Option → null for None, inner value for Some
  if (rawType === "option") {
    if (value === null || value === undefined) return null;
    if (!children?.length) return value;
    if (children.length === 1) return convertPapiNodeToTableValue(children[0]);
    return children.map(convertPapiNodeToTableValue);
  }

  // Tuple → ordered array
  if (rawType === "tuple") {
    if (!children?.length) return null;
    return children.map(convertPapiNodeToTableValue);
  }

  // Leaf primitive
  if (value !== undefined) return value;

  // Fallback: unnamed children → array
  if (children?.length) return children.map(convertPapiNodeToTableValue);

  return null;
}

export function convertPapiCallTreeToTableView(callTree) {
  if (!callTree?.section || !callTree?.method) return {};
  const args = {};
  for (const child of (callTree.children || []).filter(Boolean)) {
    const key = child.name ?? child.type ?? String(Object.keys(args).length);
    args[key] = convertPapiNodeToTableValue(child);
  }
  return { section: callTree.section, method: callTree.method, args };
}
