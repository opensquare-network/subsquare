import Link from "next/link";
import { isExternalLink } from "next-common/utils";
import Tooltip from "next-common/components/tooltip";
import NavMenuItemGroup from "./group";
import { useNavSubmenuVisible } from "next-common/context/nav";
import { useNavMenuView } from "..";
import NavMenuItemTemplate from "./itemTemplate";

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
      <NavMenuItemTemplate
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

  if (items?.length) {
    return (
      <NavMenuItemGroup
        menu={item}
        navSubmenuVisible={navSubmenuVisible}
        setNavSubmenuVisible={setNavSubmenuVisible}
        padSubMenuItems={false}
      />
    );
  }

  let content = (
    <NavMenuItemTemplate
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

  if (item?.pathname) {
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
