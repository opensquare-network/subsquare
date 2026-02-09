import camelCase from "lodash.camelcase";
import { Binary } from "polkadot-api";
import { getTypeName } from "./typeName.mjs";
import { isNil } from "lodash-es";

function makeNode(typeName, opts) {
  return Object.assign({ type: typeName }, opts || {});
}

function valueToJson(value) {
  if (isNil(value)) {
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

function normalizeFieldName(fieldName) {
  return fieldName ? camelCase(fieldName) : fieldName;
}

function removeEmptyChildren(node) {
  if (node.children && node.children.length === 0) {
    delete node.children;
  }
  return node;
}

function getOriginalFieldTypeId(rawMetadata, fieldName, defaultTypeId) {
  if (!rawMetadata) {
    return defaultTypeId;
  }

  const rawFields = rawMetadata.def?.value;
  if (!rawFields) {
    return defaultTypeId;
  }

  const rawField = rawFields.find((f) => f.name === fieldName);
  return rawField?.type !== undefined ? rawField.type : defaultTypeId;
}

function getRawMetadata(metadata, typeId) {
  return typeId !== undefined ? metadata?.lookup?.[typeId] : null;
}

function getRawVariantFields(metadata, typeId, variantName) {
  const rawMetadata = getRawMetadata(metadata, typeId);
  if (rawMetadata?.def?.tag !== "variant") {
    return null;
  }

  const rawVariant = rawMetadata.def.value?.find((v) => v.name === variantName);
  return rawVariant?.fields;
}

function buildCompositeStructEntry(rawFields, lookup, resolvedTypeId) {
  const fields = {};
  for (const field of rawFields) {
    const fName = field.name || `field_${Object.keys(fields).length}`;
    fields[fName] = {
      id: field.type,
      ...lookup(field.type),
    };
  }
  return {
    id: resolvedTypeId,
    type: "struct",
    value: fields,
  };
}

function handleSingleFieldComposite(field, value, lookup, resolvedTypeId) {
  const fieldName = field.name || "value";
  const structValue = { [fieldName]: value };

  const fields = {
    [fieldName]: {
      id: field.type,
      ...lookup(field.type),
    },
  };

  return {
    lookupEntry: {
      id: resolvedTypeId,
      type: "struct",
      value: fields,
    },
    transformedValue: structValue,
  };
}

function tryConvertCompositeToStruct(
  rawMetadata,
  value,
  lookup,
  resolvedTypeId,
) {
  if (!rawMetadata?.path?.length || rawMetadata.def?.tag !== "composite") {
    return null;
  }

  const rawFields = rawMetadata.def.value;
  if (!rawFields) {
    return null;
  }

  if (rawFields.length === 1) {
    return handleSingleFieldComposite(
      rawFields[0],
      value,
      lookup,
      resolvedTypeId,
    );
  }

  return {
    lookupEntry: buildCompositeStructEntry(rawFields, lookup, resolvedTypeId),
    transformedValue: value,
  };
}

function handleLookupEntryVariant(
  variantValue,
  variantTypeId,
  variantName,
  fieldName,
  typeName,
  lookup,
  metadata,
) {
  // If no fieldName, skip enum wrapper and show variant directly
  if (!fieldName) {
    return toTypedCallTree(
      variantValue,
      lookup,
      variantTypeId,
      variantName,
      metadata,
    );
  }

  // Otherwise, nest variant inside enum node
  const node = makeNode(typeName, {
    name: fieldName,
    rawType: "enum",
    children: [],
  });

  const child = toTypedCallTree(
    variantValue,
    lookup,
    variantTypeId,
    variantName,
    metadata,
  );
  if (child) node.children.push(child);

  return node;
}

function handleStructVariant(
  variant,
  variantValue,
  variantName,
  variantTypeName,
  typeId,
  metadata,
  lookup,
) {
  const variantNode = makeNode(variantTypeName, {
    name: variantName,
    rawType: "struct",
    children: [],
  });

  const rawFields = getRawVariantFields(metadata, typeId, variantName);

  for (const [fieldName, typeDef] of Object.entries(variant.value)) {
    const originalTypeId = getOriginalFieldTypeId(
      { def: { value: rawFields } },
      fieldName,
      typeDef.id,
    );

    const child = toTypedCallTree(
      variantValue[fieldName],
      lookup,
      originalTypeId,
      normalizeFieldName(fieldName),
      metadata,
    );
    variantNode.children.push(child);
  }

  return variantNode;
}

function handleArrayVariant(variant, variantValue, lookup, metadata) {
  const children = [];
  variantValue.forEach((item, i) => {
    const child = toTypedCallTree(
      item,
      lookup,
      variant.value.id,
      `[${i}]`,
      metadata,
    );
    if (child) children.push(child);
  });
  return children;
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
      name: fieldName,
      rawType: "enum",
      value: variantValue,
    });
  }

  let variant = lookupEntry.value[variantName];
  let variantTypeId = null;

  // Handle lookupEntry variants
  if (variant.type === "lookupEntry") {
    variant = variant.value;
    variantTypeId = variant.id;
    return handleLookupEntryVariant(
      variantValue,
      variantTypeId,
      variantName,
      fieldName,
      typeName,
      lookup,
      metadata,
    );
  }

  // Handle inline variants (struct, void, array, sequence)
  const nodeName = fieldName || variantName;
  const variantTypeName = typeName; // Use parent enum type name for inline variants
  const node = makeNode(typeName, {
    name: nodeName,
    rawType: "enum",
    children: [],
  });

  if (variant.type === "void") {
    node.children = [
      makeNode(variantName, {
        name: variantName,
        rawType: "void",
      }),
    ];
  } else if (!isNil(variantValue)) {
    if (variant.type === "struct") {
      const variantNode = handleStructVariant(
        variant,
        variantValue,
        variantName,
        variantTypeName,
        typeId,
        metadata,
        lookup,
      );
      node.children.push(variantNode);
    } else if (["array", "sequence"].includes(variant.type)) {
      node.children = handleArrayVariant(
        variant,
        variantValue,
        lookup,
        metadata,
      );
    }
  }

  return removeEmptyChildren(node);
}

function createContainerNode(typeName, fieldName, rawType, children = []) {
  return makeNode(typeName, {
    name: fieldName,
    rawType,
    children,
  });
}

function processArrayElements(items, elementTypeId, lookup, metadata) {
  const children = [];
  items.forEach((item, i) => {
    const child = toTypedCallTree(
      item,
      lookup,
      elementTypeId,
      `[${i}]`,
      metadata,
    );
    if (child) children.push(child);
  });
  return children;
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
  const node = createContainerNode(typeName, fieldName, "struct");
  const rawMetadata = getRawMetadata(metadata, typeId);

  for (const [fName, typeDef] of Object.entries(lookupEntry.value)) {
    const originalTypeId = getOriginalFieldTypeId(
      rawMetadata,
      fName,
      typeDef.id,
    );

    const child = toTypedCallTree(
      value ? value[fName] : undefined,
      lookup,
      originalTypeId,
      normalizeFieldName(fName),
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
  const node = createContainerNode(typeName, fieldName, "tuple");

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
  const children = processArrayElements(value, elementTypeId, lookup, metadata);
  return createContainerNode(typeName, fieldName, "array", children);
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
  const children = processArrayElements(value, elementTypeId, lookup, metadata);
  return createContainerNode(typeName, fieldName, "sequence", children);
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
  return makeNode(typeName, {
    name: fieldName,
    rawType: lookupEntry.type,
    value: valueToJson(value),
  });
}

function toTypedLookupEntry(
  value,
  lookup,
  typeId,
  fieldName,
  metadata,
  lookupEntry,
) {
  return toTypedCallTree(value, lookup, lookupEntry.value.id, null, metadata);
}

function resolveLookupEntry(resolvedTypeId, metadata, value, lookup) {
  const rawMetadata = getRawMetadata(metadata, resolvedTypeId);

  // Try to convert composite types to struct
  const compositeResult = tryConvertCompositeToStruct(
    rawMetadata,
    value,
    lookup,
    resolvedTypeId,
  );

  if (compositeResult) {
    return {
      lookupEntry: compositeResult.lookupEntry,
      resolvedTypeId,
      value: compositeResult.transformedValue,
    };
  }

  return {
    lookupEntry: lookup(resolvedTypeId),
    resolvedTypeId,
    value,
  };
}

function handleNullValue(typeName, fieldName, rawType) {
  if (fieldName) {
    return makeNode(typeName, {
      name: fieldName,
      rawType,
      value: null,
    });
  }
  return { value: null, type: typeName, rawType };
}

function dispatchByType(
  lookupEntry,
  value,
  lookup,
  resolvedTypeId,
  fieldName,
  metadata,
  typeName,
) {
  const handlers = {
    enum: toTypedEnum,
    struct: toTypedStruct,
    tuple: toTypedTuple,
    sequence: toTypedVec,
    array: toTypedArray,
    option: toTypedEnum, // Option and Result are enums
    result: toTypedEnum,
    lookupEntry: toTypedLookupEntry,
  };

  const handler = handlers[lookupEntry.type];
  if (handler) {
    // Validate value type for specific handlers
    if (
      lookupEntry.type === "struct" &&
      (typeof value !== "object" || Array.isArray(value))
    ) {
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
    if (
      ["tuple", "sequence", "array"].includes(lookupEntry.type) &&
      !Array.isArray(value)
    ) {
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

    return handler(
      value,
      lookup,
      resolvedTypeId,
      fieldName,
      metadata,
      lookupEntry,
      typeName,
    );
  }

  // Default to primitive handler
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

export function toTypedCallTree(
  value,
  lookup,
  typeRef,
  fieldName = null,
  metadata = null,
) {
  // Resolve lookup entry and handle composite types
  const {
    lookupEntry,
    resolvedTypeId,
    value: transformedValue,
  } = resolveLookupEntry(typeRef, metadata, value, lookup);

  const typeName = getTypeName(lookupEntry, metadata, resolvedTypeId);

  if (isNil(transformedValue)) {
    return handleNullValue(typeName, fieldName, lookupEntry.type);
  }

  return dispatchByType(
    lookupEntry,
    transformedValue,
    lookup,
    resolvedTypeId,
    fieldName,
    metadata,
    typeName,
  );
}

export default { toTypedCallTree };
