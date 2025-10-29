import SortedDescSVG from "./sorted_desc.svg";
import SortedAscSVG from "./sorted_asc.svg";
import { cn } from "next-common/utils";

export default function SortableColumn({
  name,
  sortDirection,
  sortDirectionIcon = "left",
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
        sortDirectionIcon === "right" && "flex-row-reverse",
        className,
      )}
    >
      {sorted &&
        (sortDirection === "asc" ? (
          <SortedAscSVG className="max-sm:hidden" />
        ) : (
          <SortedDescSVG className="max-sm:hidden" />
        ))}
      <span>{name}</span>
    </div>
  );
}
