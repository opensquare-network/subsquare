import { cn } from "next-common/utils";
import noop from "lodash.noop";
import Link from "next/link";
import { isExternalLink } from "next-common/utils";
import Tooltip from "next-common/components/tooltip";

export default function NavMenuItem({
  active,
  collapsed,
  icon,
  label,
  activeCount,
  extra,
  link,
  onClick = noop,
  className = "",
  hoverTooltipLabel = true,
}) {
  const isExternal = isExternalLink(link);

  let content = (
    <div
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
            "[&_svg_path]:fill-navigationIcon",
            active && "[&_svg_path]:fill-theme500",
            "group-hover/menu-item:[&_svg_path]:fill-theme500",
          )}
        >
          {icon}
        </span>
      )}
      <span
        className={cn(
          collapsed && "hidden",
          "w-full inline-flex justify-between items-center",
        )}
      >
        <span>
          {label}{" "}
          {!!activeCount && (
            <span className="ml-2 text-navigationTextTertiary">
              {activeCount}
            </span>
          )}
          {isExternal && (
            <span className="ml-1 text-navigationTextTertiary">↗</span>
          )}
        </span>
        <span>{extra}</span>
      </span>
    </div>
  );

  if (link) {
    content = (
      <Link
        href={link || ""}
        target={isExternal ? "_blank" : "_self"}
        className="w-full"
      >
        {content}
      </Link>
    );
  }

  if (collapsed && hoverTooltipLabel) {
    content = (
      <Tooltip
        side="right"
        content={label}
        sideOffset={20}
        className="flex w-full"
      >
        {content}
      </Tooltip>
    );
  }

  return content;
}
