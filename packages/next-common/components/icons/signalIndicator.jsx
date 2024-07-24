import { cn } from "next-common/utils";

export default function SignalIndicator({ active, className = "" }) {
  return (
    <div
      className={cn(
        "w-6 h-6 rounded-full bg-neutral100 relative flex items-center justify-center",
        className,
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
  );
}

function Indicator({ className = "" }) {
  return (
    <div
      className={cn(
        "absolute w-full h-full",
        "w-[38%] h-[38%] rounded-[inherit]",
        className,
      )}
    />
  );
}
