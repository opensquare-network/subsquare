import { ArrowUp } from "@osn/icons/subsquare";
import clsx from "clsx";
import { useState } from "react";

export default function Accordion({
  children,
  title = "",
  defaultOpen = true,
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="py-6">
      <div className="flex items-center justify-between px-6">
        <h4 className="text16Bold">{title}</h4>
        <ArrowUp
          role="button"
          className={clsx(
            "[&_path]:stroke-textTertiary",
            !open && "rotate-180",
          )}
          onClick={() => setOpen((v) => !v)}
        />
      </div>

      <div
        className={clsx(
          !open && "hidden",
          "border border-neutral300 shadow-100 rounded-3xl p-6 mt-6",
        )}
      >
        <div>{children}</div>
      </div>
    </div>
  );
}
