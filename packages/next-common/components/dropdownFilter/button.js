import SecondaryButton from "next-common/lib/button/secondary";
import PrimaryButton from "next-common/lib/button/primary";
import {
  useCommittedFilterState,
  useDefaultFilterValues,
  useDropdownDisplayState,
  useStagedFilterState,
} from "./context";

export function ApplyFilterButton() {
  const [, setCommittedFilter] = useCommittedFilterState();
  const [stagedFilter] = useStagedFilterState();
  const [, setShowDropdown] = useDropdownDisplayState();

  return (
    <PrimaryButton
      size="small"
      onClick={() => {
        setCommittedFilter(stagedFilter);
        setShowDropdown(false);
      }}
    >
      Apply
    </PrimaryButton>
  );
}

export function ResetFilterButton() {
  const [, setStagedFilter] = useStagedFilterState();
  const [, setCommittedFilter] = useCommittedFilterState();
  const [, setShowDropdown] = useDropdownDisplayState();
  const defaultFilterValues = useDefaultFilterValues();

  return (
    <SecondaryButton
      size="small"
      onClick={() => {
        setStagedFilter(defaultFilterValues);
        setCommittedFilter(defaultFilterValues);
        setShowDropdown(false);
      }}
    >
      Reset
    </SecondaryButton>
  );
}
