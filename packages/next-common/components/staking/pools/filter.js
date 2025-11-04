import {
  DropdownFilterProvider,
  useCommittedFilterState,
  useStagedFilterState,
} from "next-common/components/dropdownFilter/context";
import { DropdownFilter } from "next-common/components/dropdownFilter";
import Select from "next-common/components/select";
import { useMemo } from "react";

const poolsStatusOptions = [
  { value: "", label: "All" },
  { value: "open", label: "Open" },
  { value: "destroying", label: "Destroying" },
  { value: "blocked", label: "Blocked" },
];

export function StakingFilter() {
  const [filters, setFilters] = useStagedFilterState();
  const status = filters?.status || "";

  const handleStatusChange = (option) => {
    setFilters({ ...filters, status: option.value });
  };

  return (
    <DropdownFilter className="w-[240px]">
      <div className="flex items-center text12Medium">
        <span className="text-textPrimary my-[12px] w-full">Status</span>
        <Select
          small
          className="w-[144px] text12Medium"
          options={poolsStatusOptions}
          value={status}
          onChange={handleStatusChange}
        />
      </div>
    </DropdownFilter>
  );
}

export function StakingFilterProvider({ children }) {
  return (
    <DropdownFilterProvider
      defaultFilterValues={{ status: "" }}
      emptyFilterValues={{ status: "" }}
    >
      {children}
    </DropdownFilterProvider>
  );
}

export function useFilteredPools(pools) {
  const [{ status }] = useCommittedFilterState();

  return useMemo(() => {
    if (!pools) {
      return null;
    }
    let filtered = pools;
    if (status) {
      filtered = filtered.filter(
        (pool) => pool.state?.toLowerCase() === status.toLowerCase(),
      );
    }
    return filtered;
  }, [pools, status]);
}
