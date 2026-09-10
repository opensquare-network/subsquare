import { noop } from "lodash-es";
import { useRef, useState } from "react";
import { useClickAway } from "react-use";
import { cn } from "next-common/utils";

// Pieces shared by the split button components: splitButton.jsx (primary /
// secondary colors) and splitMenuButton.jsx.

// Dropdown open state of a split button's arrow part.
export function useSplitDropdown() {
  const [showDropdown, setShowDropdown] = useState(false);
  const anchorRef = useRef();
  useClickAway(anchorRef, () => setShowDropdown(false));

  return {
    showDropdown,
    anchorRef,
    closeDropdown: () => setShowDropdown(false),
    toggleDropdown: () => setShowDropdown((show) => !show),
  };
}

// Floating panel anchored to the arrow part of a split button; closing it on
// click happens after the item's own onClick ran.
export function DropdownPanel({ onClick, children }) {
  return (
    <div
      className={cn(
        "z-[999999] absolute top-[calc(100%+4px)] right-0",
        "min-w-[calc(100%+2px)] py-2 px-0",
        "shadow-200 rounded dark:border dark:border-neutral300",
        "whitespace-nowrap bg-neutral100 text-textPrimary",
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

function MenuItem({ icon, label, onClick = noop }) {
  return (
    <div
      className="flex items-center cursor-pointer hover:bg-neutral200 rounded-[6px]"
      onClick={onClick}
    >
      <div className="m-[8px]">{icon}</div>
      <div className="text14Medium text-textPrimary mr-[16px]">{label}</div>
    </div>
  );
}

// Items of the *MenuButton variants: { icon, label, onClick }[].
export function DropdownMenu({ items }) {
  return (
    <div className="px-[8px]">
      {items.map(({ icon, label, onClick }, index) => (
        <MenuItem key={index} icon={icon} label={label} onClick={onClick} />
      ))}
    </div>
  );
}
