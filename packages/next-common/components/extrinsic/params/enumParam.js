import { useCallback, useEffect, useMemo, useState } from "react";
import { getTypeDef } from "@polkadot/types";
import Select from "next-common/components/select";
import useApi from "next-common/utils/hooks/useApi";
import Param from "./param";
import { useObjectItemState } from "next-common/hooks/useItemState";

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

export default function EnumParam({ def, value, setValue }) {
  const api = useApi();

  const { options, subTypes } = useMemo(() => {
    if (!api?.registry) {
      return { options: [], subTypes: [] };
    }
    return getOptions(api?.registry, def);
  }, [api, def]);

  const [enumType, setEnumType] = useState();

  const [itemValue, setItemValue] = useObjectItemState({
    items: value,
    itemIndex: enumType,
    setItems: setValue,
  });

  const onSelectEnumOption = useCallback(
    (o) => {
      if (enumType === o.value) return;
      setEnumType(o.value);
      setValue({
        [o.value]: undefined,
      });
    },
    [enumType],
  );

  useEffect(() => {
    const type = options?.[0]?.value;
    setEnumType(type);
    setValue({
      [type]: undefined,
    });
  }, [options?.[0]?.value, setValue]);

  const subType = (subTypes || []).find((item) => item.name === enumType);

  return (
    <div className="flex flex-col gap-[8px]">
      <Select
        options={options}
        value={enumType}
        onChange={onSelectEnumOption}
        maxDisplayItem={5}
      />
      {subType && (
        <Param
          key={subType.name}
          name={subType.name}
          def={subType}
          indent={true}
          value={itemValue}
          setValue={setItemValue}
        />
      )}
    </div>
  );
}
