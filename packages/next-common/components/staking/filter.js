import { DropdownFilter } from "next-common/components/dropdownFilter";
import { useStagedFilterState } from "next-common/components/dropdownFilter/context";
import Toggle from "../toggle";

export function ValidatorsFilter() {
  const [filters, setFilters] = useStagedFilterState();
  const isActive = filters?.active || false;

  const setIsActive = (active) => {
    setFilters({ ...filters, active });
  };

  return (
    <DropdownFilter>
      <div className="flex items-center text12Medium">
        <span className="text-textPrimary my-[12px] w-[144px]">Active</span>
        <Toggle size="small" isOn={isActive} onToggle={setIsActive} />
      </div>
    </DropdownFilter>
  );
}
