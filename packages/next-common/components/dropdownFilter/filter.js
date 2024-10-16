import { useEffect, useRef } from "react";
import { useClickAway } from "react-use";
import { SystemFilter } from "@osn/icons/subsquare";
import { OptionsPadRightWrapper } from "../select/styled";
import SecondaryButton from "next-common/lib/button/secondary";
import {
  useCommittedFilterState,
  useDropdownDisplayState,
  useStagedFilterState,
} from "./context";

function DropdownFilterPanel({ children }) {
  const [committedFilter] = useCommittedFilterState();
  const [, setStagedFilter] = useStagedFilterState();

  useEffect(() => {
    setStagedFilter(committedFilter);
  }, [committedFilter, setStagedFilter]);

  return <OptionsPadRightWrapper>{children}</OptionsPadRightWrapper>;
}

export function DropdownFilter({ name = "Filter", children }) {
  const [showDropdown, setShowDropdown] = useDropdownDisplayState();
  const ref = useRef();
  useClickAway(ref, () => setShowDropdown(false));
  const [filters] = useCommittedFilterState();

  const numFilters = Object.keys(filters).length;

  return (
    <div ref={ref} className="relative">
      <SecondaryButton
        size="small"
        iconLeft={<SystemFilter className="w-4 h-4" />}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div className="flex items-center gap-[4px] text12Medium">
          <span className="text-textPrimary">{name}</span>
          {numFilters > 0 && (
            <span className="text-textTertiary">{numFilters}</span>
          )}
        </div>
      </SecondaryButton>
      {showDropdown && <DropdownFilterPanel>{children}</DropdownFilterPanel>}
    </div>
  );
}
