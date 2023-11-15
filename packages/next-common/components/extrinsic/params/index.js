import IndentPanel from "next-common/components/callTreeView/indentPanel";
import ItemParam from "./itemParam";
import { useCallback } from "react";
import noop from "lodash.noop";

export default function Params({ params, value = [], setValue = noop }) {
  const _setValue = useCallback(
    (index, v) => {
      const newValue = [...value];
      newValue[index] = v;
      setValue(newValue);
    },
    [value, setValue],
  );

  if (!params || params?.length === 0) {
    return null;
  }

  return (
    <IndentPanel className="flex flex-col gap-[8px]">
      {params.map((param, index) => (
        <ItemParam
          key={param.name}
          name={param?.name}
          def={param?.type}
          index={index}
          value={value[index]}
          setValue={_setValue}
        />
      ))}
    </IndentPanel>
  );
}
