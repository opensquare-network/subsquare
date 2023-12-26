import { useMemo } from "react";
import { getTypeDef } from "@polkadot/types/create";

function expandDef(registry, td) {
  try {
    return getTypeDef(registry.createType(td.type).toRawType());
  } catch {
    return td;
  }
}

function getDefs(registry, type) {
  const typeDef = expandDef(registry, type);

  return typeDef.sub
    ? (Array.isArray(typeDef.sub) ? typeDef.sub : [typeDef.sub]).map((td) => ({
        length: typeDef.length,
        name: td.name,
        type: td,
      }))
    : [];
}

export default function useParamDefs(registry, type) {
  return useMemo(() => getDefs(registry, type), [registry, type]);
}
