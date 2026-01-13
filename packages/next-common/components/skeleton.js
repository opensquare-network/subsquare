import { cn } from "next-common/utils";

export function Skeleton({ className }) {
  return (
    <div
      className={cn(
        "bg-gradient-to-r from-neutral300-80 to-neutral300-20 animate-pulse rounded",
        className,
      )}
    ></div>
  );
}
