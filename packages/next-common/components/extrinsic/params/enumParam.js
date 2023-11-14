import { useMemo, useState } from "react";
import { getTypeDef } from "@polkadot/types";
import Select from "next-common/components/select";
import useApi from "next-common/utils/hooks/useApi";
import IndentPanel from "next-common/components/callTreeView/indentPanel";
import Param from "./param";

function getSubTypes(registry, type) {
  return getTypeDef(registry.createType(type.type).toRawType()).sub;
}

function getOptions(registry, type) {
  const subTypes = getSubTypes(registry, type).filter(
    ({ name }) => !!name && !name.startsWith("__Unused"),
  );

  return {
    options: subTypes.map(({ name }) => ({
      label: name,
      value: name,
    })),
    subTypes,
  };
}

export default function EnumParam({ def }) {
  const api = useApi();

  const { options, subTypes } = useMemo(() => {
    if (!api?.registry) {
      return { options: [], subTypes: [] };
    }
    return getOptions(api?.registry, def);
  }, [api, def]);

  const [enumType, setEnumType] = useState(options?.[0]?.value);
  const subType = (subTypes || []).find((item) => item.name === enumType);

  return (
    <div>
      <Select
        options={options}
        value={enumType}
        onChange={(o) => setEnumType(o.value)}
      />
      {subType && (
        <IndentPanel className="flex flex-col gap-[8px]">
          <Param key={subType.name} name={subType.name} def={subType} />
        </IndentPanel>
      )}
    </div>
  );
}
