import { useMemo } from "react";
import { DropdownFilter } from "next-common/components/dropdownFilter";
import {
  DropdownFilterProvider,
  useCommittedFilterState,
  useStagedFilterState,
} from "next-common/components/dropdownFilter/context";
import Toggle from "../../toggle";

export function ValidatorsFilter() {
  const [filters, setFilters] = useStagedFilterState();
  const isActive = filters?.active || false;
  const hasIdentity = filters?.hasIdentity || false;
  const no100Commission = filters?.no100Commission || false;

  const setIsActive = (active) => {
    setFilters({ ...filters, active });
  };
  const setHasIdentity = (hasIdentity) => {
    setFilters({ ...filters, hasIdentity });
  };
  const setNo100Commission = (no100Commission) => {
    setFilters({ ...filters, no100Commission });
  };

  return (
    <DropdownFilter className="w-[240px]">
      <div className="flex items-center text12Medium">
        <span className="text-textPrimary my-[12px] w-full">Active only</span>
        <Toggle size="small" isOn={isActive} onToggle={setIsActive} />
      </div>
      <div className="flex items-center text12Medium">
        <span className="text-textPrimary my-[12px] w-full">Has identity</span>
        <Toggle size="small" isOn={hasIdentity} onToggle={setHasIdentity} />
      </div>
      <div className="flex items-center text12Medium">
        <span className="text-textPrimary my-[12px] w-full">
          No 100% commission
        </span>
        <Toggle
          size="small"
          isOn={no100Commission}
          onToggle={setNo100Commission}
        />
      </div>
    </DropdownFilter>
  );
}

export function useFilteredValidators(validators) {
  const [{ active: isActive, no100Commission, hasIdentity }] =
    useCommittedFilterState();
  return useMemo(() => {
    if (!validators) {
      return null;
    }
    let filtered = isActive ? validators.filter((v) => v.isActive) : validators;
    filtered = no100Commission
      ? filtered.filter((v) => v.commission < 1000000000)
      : filtered;
    filtered = hasIdentity ? filtered.filter((v) => v.name) : filtered;
    return filtered;
  }, [validators, isActive, no100Commission, hasIdentity]);
}

export function ValidatorsFilterProvider({ children }) {
  return (
    <DropdownFilterProvider
      defaultFilterValues={{
        active: true,
        no100Commission: true,
        hasIdentity: true,
      }}
      emptyFilterValues={{
        active: false,
        no100Commission: false,
        hasIdentity: false,
      }}
    >
      {children}
    </DropdownFilterProvider>
  );
}
