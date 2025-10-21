import SortedSVG from "./sorted.svg";
import { cn } from "next-common/utils";

export default function SortableColumn({
  name,
  sorted = true,
  onClick,
  className,
}) {
  return (
    <div
      role="button"
      onClick={onClick}
      className={cn(
        "max-sm:pointer-events-none inline-flex items-center gap-2",
        className,
      )}
    >
      {sorted && <SortedSVG className="max-sm:hidden" />}
      <span>{name}</span>
    </div>
  );
}
