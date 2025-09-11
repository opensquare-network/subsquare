import {
  useCommittedFilterState,
  useStagedFilterState,
} from "next-common/components/dropdownFilter/context";
import Select from "next-common/components/select";

const options = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Promotion",
    value: "promotion",
  },
  {
    label: "Retention",
    value: "retention",
  },
].map(({ label, value }) => ({
  label,
  value,
}));

function WishTypeFilterSelect({ wishTypeFilter, setWishTypeFilter }) {
  return (
    <div className="flex items-center justify-between gap-[8px]">
      <span className="text12Medium text-textPrimary whitespace-nowrap my-[12px]">
        Wish
      </span>
      <Select
        className="w-[144px] text12Medium"
        optionsPadding="right"
        small
        value={wishTypeFilter}
        options={options}
        onChange={(option) => {
          setWishTypeFilter(option.value);
        }}
      />
    </div>
  );
}

export function useWishTypeSelectInDropdown() {
  const [stagedFilter, setStagedFilter] = useStagedFilterState();
  const [committedFilter] = useCommittedFilterState();

  return {
    wishTypeFilter: committedFilter.wish,
    component: (
      <WishTypeFilterSelect
        wishTypeFilter={stagedFilter.wish || "all"}
        setWishTypeFilter={(wish) => {
          setStagedFilter({ ...stagedFilter, wish });
        }}
      />
    ),
  };
}
