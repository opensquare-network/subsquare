import { cn } from "next-common/utils";

export function Skeleton({ className }) {
  return (
    <div
      className={cn(
        "bg-[linear-gradient(90deg,#F6F7FA_0%,rgba(246,247,250,0.5)_49.5%,#F6F7FA_100%)]",
        className,
      )}
    ></div>
  );
}
