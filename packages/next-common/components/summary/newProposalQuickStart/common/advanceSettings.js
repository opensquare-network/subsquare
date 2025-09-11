import { useState } from "react";
import { ArrowDown } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";
import Divider from "next-common/components/styled/layout/divider";
import SecondaryButton from "next-common/lib/button/secondary";

export default function AdvanceSettings({ children }) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  return (
    <>
      <div className="flex items-center justify-center w-full gap-4">
        <Divider className="flex-1" />

        <SecondaryButton
          size="small"
          onClick={() => {
            setShowAdvanced(!showAdvanced);
          }}
          iconRight={
            <ArrowDown
              className={cn(
                showAdvanced && "rotate-180",
                "w-4 h-4 text-textTertiary",
              )}
            />
          }
        >
          Advanced
        </SecondaryButton>

        <Divider className="flex-1" />
      </div>
      <div className={showAdvanced ? "space-y-4" : "hidden"}>{children}</div>
    </>
  );
}
