import { cn } from "next-common/utils";
import { noop } from "lodash-es";
import Link from "next/link";
import { isExternalLink } from "next-common/utils";
import Tooltip from "next-common/components/tooltip";
import NavMenuGroup from "./group";
import { useNavSubmenuVisible } from "next-common/context/nav";

export default function NavMenuItem({
  item,
  active,
  collapsed,
  extra,
  onClick,
  className = "",
  hoverTooltipLabel = true,
  items,
}) {
  const isExternal = isExternalLink(item?.pathname);
  const [navSubmenuVisible, setNavSubmenuVisible] = useNavSubmenuVisible();

  let content = items?.length ? (
    <NavMenuGroup
      menu={item}
      navSubmenuVisible={navSubmenuVisible}
      setNavSubmenuVisible={setNavSubmenuVisible}
      padSubMenuItems={false}
    />
  ) : (
    <div
      onClick={item?.onClick || onClick || noop}
      className={cn(
        "group/menu-item",
        "text-navigationText",
        "w-full h-10 flex px-2 py-2.5 gap-x-3 items-center rounded-lg cursor-pointer text14Medium",
        "hover:text-theme500",
        active && "text-theme500 bg-navigationActive",
        className,
      )}
    >
      {item?.icon && (
        <span
          className={cn(
            "w-6 h-6",
            "inline-flex items-center",
            "[&_svg_path]:fill-navigationIcon",
            active && "[&_svg_path]:fill-theme500",
            "group-hover/menu-item:[&_svg_path]:fill-theme500",
          )}
        >
          {item?.icon}
        </span>
      )}
      <span
        className={cn(
          "w-full inline-flex justify-between items-center",
          collapsed && "hidden",
        )}
      >
        <span>
          {item?.name}{" "}
          {!!item?.activeCount && (
            <span className="ml-1 text-navigationTextTertiary">
              {item?.activeCount}
            </span>
          )}
          {isExternal && (
            <span className="ml-1 text-navigationTextTertiary">↗</span>
          )}
        </span>
        <span>{item?.extra || extra}</span>
      </span>
    </div>
  );

  if (item?.pathname && !items) {
    content = (
      <Link
        href={item?.pathname || ""}
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
        content={item?.name}
        sideOffset={20}
        className="flex w-full"
      >
        {content}
      </Tooltip>
    );
  }

  return content;
}
