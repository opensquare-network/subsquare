import { cn } from "next-common/utils";

export default function IndentPanel({ className, children }) {
  return (
    <div
      className={cn(
        "flex flex-col pl-[16px] mt-[8px] border-l border-dashed border-neutral500 text-[12px]",
        className,
      )}
    >
      {children}
    </div>
  );
}
