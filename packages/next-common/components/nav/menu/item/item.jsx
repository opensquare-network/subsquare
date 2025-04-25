import Link from "next/link";
import { isExternalLink } from "next-common/utils";
import Tooltip from "next-common/components/tooltip";
import NavMenuItemGroup from "./group";
import { useNavMenuType, useNavSubmenuVisible } from "next-common/context/nav";
import NavMenuItemTemplate from "./itemTemplate";
import { useRouter } from "next/router";
import { NAV_MENU_TYPE } from "next-common/utils/constants";

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
  const [, setNavMenuType] = useNavMenuType();
  const router = useRouter();

  if (
    item?.type === NAV_MENU_TYPE.subspace ||
    item?.type === NAV_MENU_TYPE.archived
  ) {
    return (
      <NavMenuItemTemplate
        className={className}
        icon={item?.icon}
        name={item?.name}
        isNew={item?.isNew}
        extra={item?.extra || extra}
        collapsed={collapsed}
        onClick={() => {
          if (item?.type === NAV_MENU_TYPE.archived) {
            setNavMenuType({
              type: NAV_MENU_TYPE.archived,
              menu: item?.items,
            });
          } else if (item?.type === NAV_MENU_TYPE.subspace) {
            router.push(item?.pathname);
          }
        }}
      />
    );
  }

  if (items?.length && !item?.hideItemsOnMenu) {
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
      isNew={item?.isNew}
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
