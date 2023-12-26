import Param from "./param";
import { useArrayItemState } from "next-common/hooks/useItemState";

export default function ItemParam({ name, def, index, value, setValue }) {
  const [itemValue, setItemValue] = useArrayItemState({
    items: value,
    itemIndex: index,
    setItems: setValue,
  });

  return (
    <Param name={name} def={def} value={itemValue} setValue={setItemValue} />
  );
}
