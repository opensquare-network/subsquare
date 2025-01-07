import { useEffect, useRef } from "react";
import { useClickAway } from "react-use";
import { SystemFilter } from "@osn/icons/subsquare";
import {
  OptionsPadLeftWrapper,
  OptionsPadRightWrapper,
} from "../select/styled";
import SecondaryButton from "next-common/lib/button/secondary";
import {
  useCommittedFilterState,
  useDropdownDisplayState,
  useStagedFilterState,
} from "./context";
import useIsNearLeft from "next-common/hooks/useIsNearLeft";

function DropdownFilterPanel({ filterRef, children }) {
  const [committedFilter] = useCommittedFilterState();
  const [, setStagedFilter] = useStagedFilterState();

  useEffect(() => {
    setStagedFilter(committedFilter);
  }, [committedFilter, setStagedFilter]);

  const isNearLeft = useIsNearLeft(filterRef);

  if (isNearLeft) {
    return <OptionsPadLeftWrapper>{children}</OptionsPadLeftWrapper>;
  }

  return <OptionsPadRightWrapper>{children}</OptionsPadRightWrapper>;
}

export function DropdownFilterBase({ name = "Filter", children }) {
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
      {showDropdown && (
        <DropdownFilterPanel filterRef={ref}>{children}</DropdownFilterPanel>
      )}
    </div>
  );
}
