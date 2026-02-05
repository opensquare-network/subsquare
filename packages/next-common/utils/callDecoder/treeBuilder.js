import camelCase from "lodash.camelcase";
import { Binary } from "polkadot-api";
import { getTypeName } from "./typeName";

function makeNode(typeName, opts) {
  return Object.assign({ type: typeName }, opts || {});
}

function valueToJson(value) {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === "bigint") {
    return value.toString();
  }
  if (value instanceof Binary) {
    return value.asHex();
  }
  if (value instanceof Uint8Array) {
    return `0x${Buffer.from(value).toString("hex")}`;
  }
  return value;
}

function toTypedEnum(
  value,
  lookup,
  typeId,
  fieldName,
  metadata,
  lookupEntry,
  typeName,
) {
  if (
    !value ||
    typeof value !== "object" ||
    !value.type ||
    !("value" in value)
  ) {
    return null;
  }

  const variantName = value.type;
  const variantValue = value.value;

  if (!lookupEntry.value[variantName]) {
    return makeNode(typeName, {
      name: camelCase(fieldName),
      rawType: "enum",
      value: variantValue,
    });
  }

  let variant = lookupEntry.value[variantName];
  let variantTypeId = null;
  let variantTypeName = null;

  if (variant.type === "lookupEntry") {
    variant = variant.value;
    variantTypeId = variant.id;
    variantTypeName = getTypeName(variant, metadata, variantTypeId);
  } else if (variant.type !== "void") {
    variantTypeName = typeName;
  }

  // For lookupEntry variants
  if (variantTypeId !== null) {
    // If no fieldName (top-level enum), skip the enum wrapper and show variant directly
    if (!fieldName) {
      return toTypedCallTree(
        variantValue,
        lookup,
        variantTypeId,
        camelCase(variantName),
        metadata,
      );
    }

    // Otherwise, show the enum type and nest the variant inside
    const node = makeNode(typeName, {
      name: camelCase(fieldName),
      rawType: "enum",
      children: [],
    });

    const child = toTypedCallTree(
      variantValue,
      lookup,
      variantTypeId,
      camelCase(variantName),
      metadata,
    );
    if (child) node.children.push(child);

    return node;
  }

  // For struct/inline variants, show the variant type directly
  const nodeName = fieldName ? camelCase(fieldName) : camelCase(variantName);
  const nodeType = variantTypeName || typeName;

  const node = makeNode(nodeType, {
    name: nodeName,
    rawType: "enum",
    children: [],
  });

  if (variant.type === "void") {
    delete node.children;
  } else if (variantValue !== null && variantValue !== undefined) {
    if (variant.type === "struct") {
      const variantNode = makeNode(nodeType, {
        name: camelCase(variantName),
        rawType: "struct",
        children: [],
      });

      for (const [fieldName, typeDef] of Object.entries(variant.value)) {
        const child = toTypedCallTree(
          variantValue[fieldName],
          lookup,
          typeDef.id,
          fieldName,
          metadata,
        );
        variantNode.children.push(child);
      }

      node.children.push(variantNode);
    } else if (["array", "sequence"].includes(variant.type)) {
      variantValue.forEach((item, i) => {
        const child = toTypedCallTree(
          item,
          lookup,
          variant.value.id,
          `[${i}]`,
          metadata,
        );
        node.children.push(child);
      });
    }
  }

  if (node.children && node.children.length === 0) {
    delete node.children;
  }

  return node;
}

function toTypedLookupEntry(
  value,
  lookup,
  typeId,
  fieldName,
  metadata,
  lookupEntry,
  // typeName,
) {
  return toTypedCallTree(value, lookup, lookupEntry.value.id, null, metadata);
}

function toTypedStruct(
  value,
  lookup,
  typeId,
  fieldName,
  metadata,
  lookupEntry,
  typeName,
) {
  const node = makeNode(typeName, {
    name: camelCase(fieldName),
    rawType: "struct",
    children: [],
  });
  for (const [fieldName, typeDef] of Object.entries(lookupEntry.value)) {
    const child = toTypedCallTree(
      value ? value[fieldName] : undefined,
      lookup,
      typeDef.id,
      fieldName,
      metadata,
    );
    node.children.push(child);
  }
  return node;
}

function toTypedTuple(
  value,
  lookup,
  typeId,
  fieldName,
  metadata,
  lookupEntry,
  typeName,
) {
  const node = makeNode(typeName, {
    name: camelCase(fieldName),
    rawType: "tuple",
    children: [],
  });
  lookupEntry.value.forEach((typeDef, i) => {
    const child = toTypedCallTree(
      value && value[i] !== undefined ? value[i] : undefined,
      lookup,
      typeDef.id,
      `[${i}]`,
      metadata,
    );
    node.children.push(child);
  });
  return node;
}

function toTypedVec(
  value,
  lookup,
  typeId,
  fieldName,
  metadata,
  lookupEntry,
  typeName,
) {
  const elementTypeId = lookupEntry.value.id;
  const node = makeNode(typeName, {
    name: camelCase(fieldName),
    rawType: "sequence",
    children: [],
  });

  value.forEach((item, i) => {
    const child = toTypedCallTree(
      item,
      lookup,
      elementTypeId,
      `[${i}]`,
      metadata,
    );
    node.children.push(child);
  });

  return node;
}

function toTypedArray(
  value,
  lookup,
  typeId,
  fieldName,
  metadata,
  lookupEntry,
  typeName,
) {
  const elementTypeId = lookupEntry.value.id;
  const node = makeNode(typeName, {
    name: camelCase(fieldName),
    rawType: "array",
    children: [],
  });

  value.forEach((item, i) => {
    const child = toTypedCallTree(
      item,
      lookup,
      elementTypeId,
      `[${i}]`,
      metadata,
    );
    node.children.push(child);
  });

  return node;
}

function toTypedOption(
  value,
  lookup,
  typeId,
  fieldName,
  metadata,
  lookupEntry,
  typeName,
) {
  // Option types are handled as enums (Some/None)
  return toTypedEnum(
    value,
    lookup,
    typeId,
    fieldName,
    metadata,
    lookupEntry,
    typeName,
  );
}

function toTypedResult(
  value,
  lookup,
  typeId,
  fieldName,
  metadata,
  lookupEntry,
  typeName,
) {
  // Result types are handled as enums (Ok/Err)
  return toTypedEnum(
    value,
    lookup,
    typeId,
    fieldName,
    metadata,
    lookupEntry,
    typeName,
  );
}

function toTypedPrimitive(
  value,
  lookup,
  typeId,
  fieldName,
  metadata,
  lookupEntry,
  typeName,
) {
  const scalar = valueToJson(value);
  return makeNode(typeName, {
    name: camelCase(fieldName),
    rawType: lookupEntry.type,
    value: scalar,
  });
}

export function toTypedCallTree(
  value,
  lookup,
  typeRef,
  fieldName = null,
  metadata = null,
) {
  // typeRef may be either a numeric type id or a lookupEntry object.
  let resolvedTypeId;
  let lookupEntry;
  if (typeRef && typeof typeRef === "object" && "type" in typeRef) {
    lookupEntry = typeRef;
    resolvedTypeId = undefined;
  } else {
    lookupEntry = lookup(typeRef);
    resolvedTypeId = typeRef;
  }

  const typeName = getTypeName(lookupEntry, metadata, resolvedTypeId);

  if (value === null || value === undefined) {
    if (fieldName) {
      return makeNode(typeName, {
        name: camelCase(fieldName),
        rawType: lookupEntry.type,
        value: null,
      });
    }
    return { value: null, type: typeName, rawType: lookupEntry.type };
  }

  switch (lookupEntry.type) {
    case "enum":
      return toTypedEnum(
        value,
        lookup,
        resolvedTypeId,
        fieldName,
        metadata,
        lookupEntry,
        typeName,
      );

    case "struct":
      if (typeof value === "object" && !Array.isArray(value)) {
        return toTypedStruct(
          value,
          lookup,
          resolvedTypeId,
          fieldName,
          metadata,
          lookupEntry,
          typeName,
        );
      }
      break;

    case "tuple":
      if (Array.isArray(value)) {
        return toTypedTuple(
          value,
          lookup,
          resolvedTypeId,
          fieldName,
          metadata,
          lookupEntry,
          typeName,
        );
      }
      break;

    case "sequence":
      if (Array.isArray(value)) {
        return toTypedVec(
          value,
          lookup,
          resolvedTypeId,
          fieldName,
          metadata,
          lookupEntry,
          typeName,
        );
      }
      break;

    case "array":
      if (Array.isArray(value)) {
        return toTypedArray(
          value,
          lookup,
          resolvedTypeId,
          fieldName,
          metadata,
          lookupEntry,
          typeName,
        );
      }
      break;

    case "option":
      return toTypedOption(
        value,
        lookup,
        resolvedTypeId,
        fieldName,
        metadata,
        lookupEntry,
        typeName,
      );

    case "result":
      return toTypedResult(
        value,
        lookup,
        resolvedTypeId,
        fieldName,
        metadata,
        lookupEntry,
        typeName,
      );

    case "lookupEntry":
      return toTypedLookupEntry(
        value,
        lookup,
        typeRef,
        fieldName,
        metadata,
        lookupEntry,
        typeName,
      );

    case "primitive":
    case "compact":
    case "void":
    case "bitSequence":
    case "AccountId32":
    case "AccountId20":
    default:
      return toTypedPrimitive(
        value,
        lookup,
        resolvedTypeId,
        fieldName,
        metadata,
        lookupEntry,
        typeName,
      );
  }

  // Fallback to primitive handler
  return toTypedPrimitive(
    value,
    lookup,
    resolvedTypeId,
    fieldName,
    metadata,
    lookupEntry,
    typeName,
  );
}

export default { toTypedCallTree };
