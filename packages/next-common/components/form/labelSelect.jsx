import { noop } from "lodash-es";
import { useCallback } from "react";
import { cn } from "next-common/utils";

function Label({ selected, ...props }) {
  return (
    <div
      {...props}
      className={cn(
        "text12Medium",
        "flex flex-row justify-center items-center",
        "py-1 px-3 rounded-3xl",
        "cursor-pointer",
        "text-textSecondary border border-neutral400",
        selected && "text-theme500 border-theme500",
        !selected && "hover:text-textPrimary hover:border-neutral500",
      )}
    />
  );
}

export default function LabelSelect({
  allLabels = [],
  maxSelect = 1,
  selected = [],
  setSelected = noop,
}) {
  const selectChoice = useCallback(
    (name) => {
      setSelected((selected) => {
        if (selected.includes(name)) {
          return selected.filter((item) => item !== name);
        }
        return [...selected, name].slice(-maxSelect);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [maxSelect],
  );

  if (allLabels.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {allLabels.map((item) => (
        <Label
          key={item}
          selected={selected?.includes(item)}
          onClick={() => selectChoice(item)}
        >
          {item}
        </Label>
      ))}
    </div>
  );
}
