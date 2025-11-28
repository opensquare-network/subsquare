import {
  DropdownFilterProvider,
  useCommittedFilterState,
} from "next-common/components/dropdownFilter/context";
import Select from "next-common/components/select";
import { useMemo } from "react";

const poolsStatusOptions = [
  { value: "", label: "All" },
  { value: "open", label: "Open" },
  { value: "destroying", label: "Destroying" },
  { value: "blocked", label: "Blocked" },
];

export function StakingFilter() {
  const [committedFilter, setCommittedFilter] = useCommittedFilterState();
  const status = committedFilter?.status || "";

  const handleStatusChange = ({ value: status }) => {
    setCommittedFilter({ status });
  };

  return (
    <Select
      small
      className="w-[144px] text12Medium"
      options={poolsStatusOptions}
      value={status}
      onChange={handleStatusChange}
    />
  );
}

export function StakingFilterProvider({ children }) {
  return (
    <DropdownFilterProvider
      defaultFilterValues={{ status: "open" }}
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
