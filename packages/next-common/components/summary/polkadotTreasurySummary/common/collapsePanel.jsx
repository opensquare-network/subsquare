import { useState } from "react";
import { ArrowUp, ArrowDown } from "@osn/icons/subsquare";
import Divider from "next-common/components/styled/layout/divider";
import SummaryLayout from "next-common/components/summary/layout/layout";
import { cn } from "next-common/utils";

export default function CollapsePanel({ children, labelItem }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  const Icon = isCollapsed ? ArrowUp : ArrowDown;

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div>{labelItem}</div>
        <div
          className="flex items-center justify-center shrink-0 border rounded-[8px] w-8 h-8 cursor-pointer bg-neutral200"
          onClick={toggleCollapse}
        >
          <Icon className="w-5 h-5 [&_path]:stroke-textSecondary" />
        </div>
      </div>
      <Divider className={cn(!isCollapsed && "hidden")} />
      <SummaryLayout
        className={cn("max-sm:grid-cols-1", !isCollapsed && "hidden")}
      >
        {children}
      </SummaryLayout>
    </div>
  );
}
