import noop from "lodash.noop";
import RadioOption from "./radioOption";

export default function RadioOptionGroup({
  options,
  selected,
  setSelected = noop,
}) {
  return (
    <div className="flex flex-col gap-2">
      {(options || []).map((item) => (
        <RadioOption
          key={item.value}
          {...item}
          checked={selected === item.value}
          onClick={() => setSelected(item.value)}
        />
      ))}
    </div>
  );
}
