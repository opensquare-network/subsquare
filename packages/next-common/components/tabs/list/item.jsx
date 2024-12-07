import Tooltip from "next-common/components/tooltip";
import { cn } from "next-common/utils";
import { isValidElement } from "react";

export default function TabsListItem({
  tooltip,
  label,
  labelExtra,
  className = "",
  active,
  activeCount,
  onClick,
}) {
  const isElement = isValidElement(label);

  let content = (
    <div
      role={!isElement && "button"}
      className={cn(
        "block whitespace-nowrap pb-3",
        "text14Bold border-b-4 text-textPrimary",
        "hover:text-theme500",
        "flex items-center",
        className,
        active ? "border-theme500 text-theme500" : "border-transparent",
      )}
      onClick={onClick}
    >
      {label}
      {!!activeCount && (
        <span className="ml-1 text-textTertiary text14Medium">
          {activeCount}
        </span>
      )}
      {labelExtra}
    </div>
  );

  return <Tooltip content={tooltip}>{content}</Tooltip>;
}
