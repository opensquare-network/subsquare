import { useCallback, useEffect, useMemo, useState } from "react";
import { getTypeDef } from "@polkadot/types";
import Select from "next-common/components/select";
import Param from "./param";
import { useContextApi } from "next-common/context/api";

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

export default function EnumParam({ title, def, value, setValue }) {
  const api = useContextApi();

  const { options, subTypes } = useMemo(() => {
    if (!api?.registry) {
      return { options: [], subTypes: [] };
    }
    return getOptions(api?.registry, def);
  }, [api, def]);

  const [enumType, setEnumType] = useState();

  const itemValue = value?.data?.[enumType];
  const setItemValue = useCallback(
    (valuesOrFunction) => {
      if (typeof valuesOrFunction === "function") {
        setValue(({ data }) => {
          const newData = valuesOrFunction(data?.[enumType]);
          let isValid = true;
          if (newData !== undefined) {
            isValid = newData.isValid;
          }
          return {
            isValid,
            data: { [enumType]: newData },
          };
        });
        return;
      }

      const newData = valuesOrFunction;
      let isValid = true;
      if (newData !== undefined) {
        isValid = newData.isValid;
      }
      setValue({
        isValid,
        data: { [enumType]: newData },
      });
      return;
    },
    [setValue, enumType],
  );

  const onSelectEnumOption = useCallback(
    (o) => {
      if (enumType === o.value) {
        return;
      }
      setEnumType(o.value);
      setValue({
        isValid: true,
        data: { [o.value]: undefined },
      });
    },
    [enumType, setValue],
  );

  useEffect(() => {
    const enumType = options?.[0]?.value;
    setEnumType(enumType);
    setValue({
      isValid: true,
      data: { [enumType]: undefined },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options?.[0]?.value, setValue]);

  const subType = (subTypes || []).find((item) => item.name === enumType);

  return (
    <>
      {title}

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
    </>
  );
}
