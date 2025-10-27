import { DropdownFilter } from "next-common/components/dropdownFilter";
import { useStagedFilterState } from "next-common/components/dropdownFilter/context";
import Toggle from "../toggle";

export function ValidatorsFilter() {
  const [filters, setFilters] = useStagedFilterState();
  const isActive = filters?.active || false;
  const hasIdentity = filters?.hasIdentity || false;
  const not100Commission = filters?.not100Commission || false;

  const setIsActive = (active) => {
    setFilters({ ...filters, active });
  };
  const setHasIdentity = (hasIdentity) => {
    setFilters({ ...filters, hasIdentity });
  };
  const setNot100Commission = (not100Commission) => {
    setFilters({ ...filters, not100Commission });
  };

  return (
    <DropdownFilter className="w-[240px]">
      <div className="flex items-center text12Medium">
        <span className="text-textPrimary my-[12px] w-full">Active</span>
        <Toggle size="small" isOn={isActive} onToggle={setIsActive} />
      </div>
      <div className="flex items-center text12Medium">
        <span className="text-textPrimary my-[12px] w-full">Has identity</span>
        <Toggle size="small" isOn={hasIdentity} onToggle={setHasIdentity} />
      </div>
      <div className="flex items-center text12Medium">
        <span className="text-textPrimary my-[12px] w-full">
          Not 100% commission
        </span>
        <Toggle
          size="small"
          isOn={not100Commission}
          onToggle={setNot100Commission}
        />
      </div>
    </DropdownFilter>
  );
}
