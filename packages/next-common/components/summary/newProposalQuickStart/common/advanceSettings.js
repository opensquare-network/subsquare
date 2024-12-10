import { useState } from "react";
import { ArrowDown } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";
import Divider from "next-common/components/styled/layout/divider";

export default function AdvanceSettings({ children }) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  return (
    <>
      <div className="cursor-pointer flex items-center justify-center w-full gap-4">
        <Divider className="flex-1" />
        <div
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="inline-flex items-center gap-1.5 border border-neutral400 rounded-[6px] py-1.5 pl-3 pr-1.5"
        >
          <span className="text12Medium text-textPrimary">
            Advanced Settings
          </span>
          <ArrowDown
            className={cn(
              showAdvanced && "rotate-180",
              "w-4 h-4 [&_path]:stroke-textTertiary",
            )}
          />
        </div>
        <Divider className="flex-1" />
      </div>
      <div className={showAdvanced ? "space-y-4" : "hidden"}>{children}</div>
    </>
  );
}
