import { cn } from "next-common/utils";
import { SystemList, SystemGrid } from "@osn/icons/subsquare";
import Tooltip from "next-common/components/tooltip";

function ViewModeButton({ highlight, onClick, children }) {
  return (
    <div
      role="button"
      className={cn(
        "rounded-[4px] p-[4px] cursor-pointer",
        highlight ? "bg-neutral100 text-textPrimary" : "text-textTertiary",
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export default function ViewModeSwitch({ viewMode, setViewMode }) {
  return (
    <div className="flex p-[2px] rounded-[6px] bg-neutral300">
      <Tooltip content="List view">
        <ViewModeButton
          highlight={viewMode === "list"}
          onClick={() => setViewMode("list")}
        >
          <SystemList className="w-[16px] h-[16px]" />
        </ViewModeButton>
      </Tooltip>
      <Tooltip content="Card view">
        <ViewModeButton
          highlight={viewMode === "card"}
          onClick={() => setViewMode("card")}
        >
          <SystemGrid className="w-[16px] h-[16px]" />
        </ViewModeButton>
      </Tooltip>
    </div>
  );
}
