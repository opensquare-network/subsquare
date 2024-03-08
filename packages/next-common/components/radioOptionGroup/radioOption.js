import { noop } from "lodash-es";
import RadioButton from "./radioButton";

export default function RadioOption({ checked, label, onClick = noop }) {
  return (
    <div className="flex gap-2 cursor-pointer" onClick={onClick}>
      <RadioButton checked={checked} />
      <span>{label}</span>
    </div>
  );
}
