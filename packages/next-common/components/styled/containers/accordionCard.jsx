import { ArrowUp } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";
import { useState } from "react";

export default function AccordionCard({ children, title = "", defaultOpen }) {
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
        <ArrowUp
          role="button"
          className={cn("[&_path]:stroke-textTertiary", !open && "rotate-180")}
        />
      </div>

      <div className={cn(!open && "hidden", "p-6 pt-0")}>{children}</div>
    </div>
  );
}
