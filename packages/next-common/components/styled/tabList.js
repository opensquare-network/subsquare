import { cn } from "next-common/utils";

export function GradientBlanket({ className = "", reversed = false }) {
  return (
    <div
      className={cn(
        "absolute inset-y-0 w-24 pointer-events-none",
        "bg-gradient-to-r from-white to-transparent dark:from-[#212433]",
        "transition-opacity delay-0",
        "opacity-0",
        !reversed ? "left-0" : "right-0",
        reversed && "rotate-180",
        className,
      )}
    />
  );
}
