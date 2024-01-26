import Tooltip from "../tooltip";
import { cn } from "next-common/utils";

export default function SignalIndicator({ active, className = "" }) {
  return (
    <Tooltip className={className} content={active ? "Active" : "Inactive"}>
      <div
        className={cn(
          "w-4 h-4 rounded-full bg-neutral100 relative flex items-center justify-center",
        )}
      >
        <Indicator
          className={cn(
            active ? "bg-green500" : "bg-textDisabled",
            active && "animate-ping",
          )}
        />
        <Indicator className={cn(active ? "bg-green500" : "bg-textDisabled")} />
      </div>
    </Tooltip>
  );
}

function Indicator({ className = "" }) {
  return (
    <div
      className={cn(
        "absolute w-full h-full",
        "w-1.5 h-1.5 rounded-[inherit]",
        className,
      )}
    />
  );
}
