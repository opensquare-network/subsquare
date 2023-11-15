import { useCallback } from "react";
import Param from "./param";

export default function ItemParam({ name, def, index, value, setValue }) {
  const _setValue = useCallback(
    (v) => {
      setValue(index, v);
    },
    [index, setValue],
  );

  return <Param name={name} def={def} value={value} setValue={_setValue} />;
}
