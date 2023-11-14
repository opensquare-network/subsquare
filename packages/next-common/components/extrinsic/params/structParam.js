import useApi from "next-common/utils/hooks/useApi";
import { useMemo } from "react";
import { getTypeDef } from "@polkadot/types/create";
import Params from ".";

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

function useParamDefs(registry, type) {
  return useMemo(() => getDefs(registry, type), [registry, type]);
}

export default function StructParam({ def }) {
  const api = useApi();
  const params = useParamDefs(api?.registry, def);

  return <Params params={params} />;
}
