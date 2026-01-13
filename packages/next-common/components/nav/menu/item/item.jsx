import Link from "next-common/components/link";
import { isExternalLink } from "next-common/utils";
import Tooltip from "next-common/components/tooltip";
import { useNavMenuType } from "next-common/context/nav";
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
}) {
  const isExternal = isExternalLink(item?.pathname);
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
        isHot={item?.isHot}
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

  let content = (
    <NavMenuItemTemplate
      className={className}
      icon={item?.icon}
      name={item?.name}
      isNew={item?.isNew}
      isHot={item?.isHot}
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
