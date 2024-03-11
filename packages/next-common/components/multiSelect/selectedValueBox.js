import SelectedValueItem from "./selectedValueItem";
import DownSVG from "./down.svg";
import { noop } from "lodash-es";
import pluralize from "pluralize";
import { cn } from "next-common/utils";

export default function SelectedValueBox({
  disabled,
  itemName,
  options = [],
  selectedValues = [],
  setSelectedValues = noop,
  showDropDown = false,
  setShowDropDown = noop,
}) {
  const showOptions = options.filter((o) => selectedValues.includes(o.value));
  const onRemove = (value) => {
    setSelectedValues(selectedValues.filter((v) => v !== value));
  };

  let selectedTracks;
  if (showOptions.length === 0) {
    selectedTracks = (
      <span className="text-textDisabled">
        Please select {pluralize(itemName)}
      </span>
    );
  } else if (showOptions.length > 2) {
    selectedTracks = (
      <span>
        Selected {showOptions.length} {pluralize(itemName)}
      </span>
    );
  } else {
    selectedTracks = showOptions.map((o) => (
      <SelectedValueItem
        key={o.value}
        title={o.label}
        onRemove={() => onRemove(o.value)}
      />
    ));
  }

  return (
    <div
      className={cn(
        "flex items-center grow",
        "py-2.5 px-4 rounded border border-neutral400",
      )}
      onClick={() => {
        if (disabled) {
          return;
        }
        setShowDropDown(!showDropDown);
      }}
    >
      <div className="flex grow flex-wrap gap-2 text14Medium text-textPrimary">
        {selectedTracks}
      </div>
      <div
        className={cn(
          "inline-flex cursor-pointer",
          showDropDown && "transform rotate-180",
        )}
      >
        <DownSVG className="[&_path]:stroke-textPrimary" />
      </div>
    </div>
  );
}
