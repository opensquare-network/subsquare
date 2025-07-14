import { noop } from "lodash-es";
import RadioButton from "../radioOptionGroup/radioButton";
import MultisigDisplay from "./multisigDisplay";

export function MultisigRadioOption({
  multisig,
  checked,
  disabled = false,
  onClick = noop,
}) {
  return (
    <MultisigDisplay multisig={multisig} onClick={onClick}>
      <RadioButton checked={checked} disabled={disabled} />
    </MultisigDisplay>
  );
}

export default function MultisigRadioOptionGroup({
  options,
  selected,
  setSelected,
}) {
  if (!options || options.length <= 0) {
    return null;
  }
  return (options || []).map((item) => {
    if (item.disabled) {
      return (
        <MultisigDisplay
          key={item.value}
          className="cursor-default bg-neutral200 border-none"
          multisig={item.multisig}
        />
      );
    }
    return (
      <MultisigRadioOption
        key={item.value}
        {...item}
        checked={selected === item.value}
        onClick={() => {
          if (item?.disabled) {
            return;
          }

          setSelected(item.value);
        }}
      />
    );
  });
}
