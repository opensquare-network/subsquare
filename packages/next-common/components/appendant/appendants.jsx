import AppendItem from "./item";
import { ArrowTriangleDown } from "@osn/icons/subsquare";
import { useState, memo } from "react";
import { cn } from "next-common/utils";
import useBountyAppendants from "next-common/hooks/useBountyAppendants";
import { useOnchainData } from "next-common/context/post";

function CollapsePanel({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="flex flex-col">
      <div className="w-full flex justify-between">
        <span className="text14Bold text-textPrimary">Appendants</span>

        <div role="button" onClick={() => setIsCollapsed((prev) => !prev)}>
          <ArrowTriangleDown
            className={cn(
              "w-5 h-5 text-textTertiary",
              !isCollapsed && "rotate-180",
            )}
          />
        </div>
      </div>

      {!isCollapsed && children}
    </div>
  );
}

function Appendants() {
  const { bountyIndex } = useOnchainData();
  const { value: appendants } = useBountyAppendants(bountyIndex);

  if (!appendants || appendants?.length === 0) {
    return null;
  }

  return (
    <CollapsePanel>
      {appendants?.map((item, index) => (
        <AppendItem key={item?._id} index={index} data={item} />
      ))}
    </CollapsePanel>
  );
}

export default memo(Appendants);
