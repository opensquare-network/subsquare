import { ApplyFilterButton, ResetFilterButton } from "./button";
import { DropdownFilter } from "./filter";

function FilterContentWrapper({ children }) {
  return (
    <div className="flex flex-col p-[16px] gap-[16px]">
      <span className="text12Bold text-textPrimary">Conditions</span>
      <div>{children}</div>
      <div className="flex justify-end gap-[8px]">
        <ResetFilterButton />
        <ApplyFilterButton />
      </div>
    </div>
  );
}

export function CommonDropdownFilter({ children }) {
  return (
    <DropdownFilter>
      <FilterContentWrapper>{children}</FilterContentWrapper>
    </DropdownFilter>
  );
}
