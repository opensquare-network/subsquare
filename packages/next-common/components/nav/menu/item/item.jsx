import { cn } from "next-common/utils";
import { noop } from "lodash-es";
import Link from "next/link";
import { isExternalLink } from "next-common/utils";
import Tooltip from "next-common/components/tooltip";
import NavMenuItemGroup from "./group";
import { useNavSubmenuVisible } from "next-common/context/nav";
import { useNavMenuView } from "..";

export default function NavMenuItemItem({
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
  const [, setNavMenuView] = useNavMenuView();

  if (item?.type === "subspace") {
    return (
      <ItemTemplate
        className={className}
        icon={item?.icon}
        name={item?.name}
        extra={item?.extra || extra}
        collapsed={collapsed}
        onClick={() => {
          setNavMenuView({
            view: "subspace",
            menu: item?.items,
          });
        }}
      />
    );
  }

  let content = items?.length ? (
    <NavMenuItemGroup
      menu={item}
      navSubmenuVisible={navSubmenuVisible}
      setNavSubmenuVisible={setNavSubmenuVisible}
      padSubMenuItems={false}
    />
  ) : (
    <ItemTemplate
      className={className}
      icon={item?.icon}
      name={item?.name}
      activeCount={item?.activeCount}
      extra={item?.extra || extra}
      collapsed={collapsed}
      isExternal={isExternal}
      active={active}
      onClick={item?.onClick || onClick}
    />
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

function ItemTemplate({
  icon,
  name,
  activeCount,
  extra,
  collapsed,
  isExternal,
  active,
  onClick = noop,
  className = "",
}) {
  return (
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
            !active && "text-navigationIcon",
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
        <span>
          {name}{" "}
          {!!activeCount && (
            <span className="ml-1 text-navigationTextTertiary">
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
}
