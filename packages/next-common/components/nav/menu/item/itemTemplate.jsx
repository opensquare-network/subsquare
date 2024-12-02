import { noop } from "lodash-es";
import { ThemedTag } from "next-common/components/tags/state/styled";
import { cn } from "next-common/utils";

export default function NavMenuItemTemplate({
  icon,
  name,
  activeCount,
  extra,
  collapsed,
  isExternal,
  active,
  onClick = noop,
  className = "",
  isNew = false,
}) {
  return (
    <div
      role="button"
      onClick={onClick}
      className={cn(
        "group/menu-item",
        "text-navigationText",
        "w-full h-10 flex px-2 py-2.5 gap-x-3 items-center rounded-lg cursor-pointer text14Medium",
        "hover:text-theme500",
        active && "text-theme500 bg-navigationActive",
        className,
      )}
    >
      {icon && (
        <span
          className={cn(
            "w-6 h-6",
            "inline-flex items-center",
            "[&_svg]:text-navigationIcon",
            active && "[&_svg]:text-theme500",
          )}
        >
          {icon}
        </span>
      )}
      <span
        className={cn(
          "w-full inline-flex justify-between items-center",
          collapsed && "hidden",
        )}
      >
        <span className="w-full">
          {name}{" "}
          {!!activeCount && (
            <span className="ml-1 text-navigationTextTertiary">
              {activeCount}
            </span>
          )}
          {isNew && <ThemedTag className="ml-1 rounded-full">New</ThemedTag>}
          {isExternal && (
            <span className="ml-1 text-navigationTextTertiary">↗</span>
          )}
        </span>
        <span>{extra}</span>
      </span>
    </div>
  );
}
