import { ArrowUp } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";
import { useState } from "react";

export default function AccordionCard({
  children,
  extra,
  title = "",
  defaultOpen,
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className={cn(
        "bg-neutral100 shadow-100",
        "border border-neutral300 rounded-xl",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between",
          "cursor-pointer p-6",
        )}
        onClick={() => setOpen(!open)}
      >
        <h4 className="text14Bold text-textPrimary">{title}</h4>
        <div className="flex gap-[4px]">
          {extra}
          <div className="flex items-center justify-center shrink-0 border rounded-[8px] w-8 h-8 cursor-pointer bg-neutral200">
            <ArrowUp
              role="button"
              className={cn(
                "w-5 h-5 [&_path]:stroke-textSecondary",
                !open && "rotate-180",
              )}
            />
          </div>
        </div>
      </div>

      <div className={cn(!open && "hidden", "p-6 pt-0")}>{children}</div>
    </div>
  );
}
