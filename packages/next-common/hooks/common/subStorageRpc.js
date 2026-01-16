function getStorageReturnType(api, storage) {
  const meta = storage.creator.meta;
  const lookup = api.registry.lookup;
  const entryType = meta.type;

  if (entryType.isPlain) {
    const typeId = entryType.asPlain;
    return lookup.getTypeDef(typeId);
  }

  if (entryType.isMap) {
    const { value } = entryType.asMap;
    return lookup.getTypeDef(value);
  }

  if (entryType.isDoubleMap) {
    const { value } = entryType.asDoubleMap;
    return lookup.getTypeDef(value);
  }

  if (entryType.isNMap) {
    const { value } = entryType.asNMap;
    return lookup.getTypeDef(value);
  }

  throw new Error("Unknown storage type");
}

function createEmptyReturnValue(api, storage) {
  const returnType = getStorageReturnType(api, storage);

  if (storage.creator.meta.modifier.isOptional) {
    return api.createType(`Option<${returnType.lookupName}>`, null);
  }

  const fallback = storage?.creator?.meta?.fallback;
  const fallbackU8a =
    fallback && typeof fallback.toU8a === "function"
      ? fallback.toU8a(true)
      : null;

  return fallbackU8a
    ? api.createType(returnType.type, fallbackU8a)
    : api.createType(returnType.type);
}

function createReturnValue(api, storage, valueU8a) {
  let decodedValue = null;
  const returnType = getStorageReturnType(api, storage);
  decodedValue = api.createType(returnType.type, valueU8a);
  if (storage.creator.meta.modifier.isOptional) {
    decodedValue = api.createType(
      `Option<${returnType.lookupName}>`,
      decodedValue,
    );
  }
  return decodedValue;
}

export async function subStorageRpc(api, storage, args = [], callback) {
  if (!api || !storage || typeof callback !== "function") {
    throw new Error(
      "Invalid parameters: api, storage, and callback are required",
    );
  }

  const storageKey = storage.key(...args);

  const unsubscribe = await api.rpc.state.subscribeStorage(
    [storageKey],
    (changes) => {
      const change = changes[0];
      if (!change) {
        return;
      }

      if (!change.isSome) {
        callback(createEmptyReturnValue(api, storage));
        return;
      }

      const rawData = change.unwrap();
      const valueU8a =
        rawData && typeof rawData.toU8a === "function"
          ? rawData.toU8a(true)
          : rawData;

      if (valueU8a?.length === 0) {
        callback(createEmptyReturnValue(api, storage));
        return;
      }

      try {
        callback(createReturnValue(api, storage, valueU8a));
      } catch (error) {
        console.error("Error decoding storage value:", error);
        callback(null);
      }
    },
  );

  return unsubscribe;
}
