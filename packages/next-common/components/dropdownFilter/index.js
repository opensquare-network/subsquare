import { cn } from "next-common/utils";
import { ApplyFilterButton, ResetFilterButton } from "./button";
import { DropdownFilterBase } from "./filter";

function FilterContentWrapper({ className, children }) {
  return (
    <div className={cn("flex flex-col p-[16px] gap-[16px]", className)}>
      <span className="text12Bold text-textPrimary">Conditions</span>
      <div>{children}</div>
      <div className="flex justify-end gap-[8px]">
        <ResetFilterButton />
        <ApplyFilterButton />
      </div>
    </div>
  );
}

export function DropdownFilter({ className, children }) {
  return (
    <DropdownFilterBase>
      <FilterContentWrapper className={className}>
        {children}
      </FilterContentWrapper>
    </DropdownFilterBase>
  );
}
