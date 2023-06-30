import clsx from "clsx";
import noop from "lodash.noop";
import Link from "next/link";
import { isExternalLink } from "next-common/utils";

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
}) {
  const isExternal = isExternalLink(link);

  let content = (
    <div
      onClick={onClick}
      className={clsx(
        "group/menu-item",
        "text-navigationText",
        "h-10 flex p-2 gap-x-3 items-center rounded-lg cursor-pointer text14Medium",
        "hover:text-theme500",
        active && "text-theme500 bg-navigationActive",
        className,
      )}
    >
      {icon && (
        <span
          className={clsx(
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
        className={clsx(
          collapsed && "hidden",
          "w-full inline-flex justify-between items-center",
        )}
      >
        <span>
          {label}{" "}
          {!!activeCount && (
            <span className="ml-2 text-textTertiaryContrast">
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
      <Link href={link || ""} target={isExternal ? "_blank" : "_self"}>
        {content}
      </Link>
    );
  }

  return content;
}
