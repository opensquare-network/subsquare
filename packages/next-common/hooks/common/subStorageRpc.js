function getStorageReturnType(api, storage) {
  const meta = storage.creator.meta;
  const lookup = api.registry.lookup;
  const entryType = meta.type;

  if (entryType.isPlain) {
    const typeId = entryType.asPlain;
    return lookup.getTypeDef(typeId);
  }

  if (entryType.isMap || entryType.isDoubleMap || entryType.isNMap) {
    const { value } = entryType.asMap;
    return lookup.getTypeDef(value);
  }

  throw new Error("Unknown storage type");
}

export async function subStorageRpc(api, storage, args = [], callback) {
  if (!api || !storage || typeof callback !== "function") {
    throw new Error(
      "Invalid parameters: api, storage, and callback are required",
    );
  }

  const storageKey = storage.key(...args);
  const returnType = getStorageReturnType(api, storage);

  const unsubscribe = await api.rpc.state.subscribeStorage(
    [storageKey],
    (changes) => {
      const change = changes[0];

      if (!change) {
        callback(null);
        return;
      }

      let decodedValue = null;

      if (change.isSome) {
        try {
          const rawData = change.unwrap();

          decodedValue = api.registry.createTypeUnsafe(
            returnType.type,
            [rawData],
            {
              isPedantic: false,
            },
          );

          if (storage.creator.meta.modifier.isOptional) {
            decodedValue = api.createType(
              `Option<${returnType.lookupName}>`,
              decodedValue,
            );
          }
        } catch (error) {
          console.error("Error decoding storage value:", error);
          callback(null);
          return;
        }
      } else if (storage.creator.meta.modifier.isOptional) {
        decodedValue = api.createType("Option<Null>", null);
      }

      callback(decodedValue);
    },
  );

  return unsubscribe;
}
