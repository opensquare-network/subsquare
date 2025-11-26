import { cn } from "next-common/utils";
import { startCase, capitalize, noop, omit, sumBy } from "lodash-es";
import { useRouter } from "next/router";
import { useState } from "react";
import { ArrowDown } from "@osn/icons/subsquare";
import * as HoverCard from "@radix-ui/react-hover-card";
import { useScreenSize } from "next-common/utils/hooks/useScreenSize";
import { useUpdateEffect } from "react-use";
import NavMenuItemItem from "./item";
import NavMenuDivider from "../../divider";
import HoverMenuItem from "./hoverItem";

export const isChildActive = (menuItems = [], pathname) => {
  return menuItems.some((menuItem) => {
    if (menuItem?.items?.length) {
      return isChildActive(menuItem.items, pathname);
    }
    return menuItem.pathname === pathname;
  });
};

export default function NavMenuItemGroup({
  menu = {},
  collapsed,
  navSubmenuVisible,
  setNavSubmenuVisible = noop,
  padSubMenuItems = true,
}) {
  const { sm } = useScreenSize();
  const router = useRouter();
  const firstPath = "/" + router.asPath.split("/").filter(Boolean)[0];

  const getSubmenuVisibility = () => {
    return collapsed
      ? false
      : firstPath === menu.pathname || navSubmenuVisible?.[menu.name];
  };

  const [submenuVisible, setSubmenuVisible] = useState(getSubmenuVisibility);

  useUpdateEffect(() => {
    setSubmenuVisible(getSubmenuVisibility());
  }, [collapsed]);

  const toggleChildMenu = () => {
    if (collapsed) {
      const defaultPagePath = menu.items?.[0]?.pathname;
      if (defaultPagePath) {
        router.push(defaultPagePath);
      }
      return;
    }

    const newVisibility = !submenuVisible;
    setSubmenuVisible(newVisibility);
    setNavSubmenuVisible({
      ...navSubmenuVisible,
      [menu.name]: newVisibility,
    });
  };

  return (
    <ul>
      <li>
        <HoverCard.Root openDelay={0} closeDelay={0}>
          <HoverCard.Trigger>
            <NavMenuItemItem
              item={{
                ...omit(menu, "pathname"),
                name: startCase(capitalize(menu.name)),
                activeCount:
                  sumBy(
                    (menu?.items || []).filter(
                      (item) => !item.excludeToSumActives,
                    ),
                    "activeCount",
                  ) ?? menu.activeCount,
              }}
              onClick={toggleChildMenu}
              collapsed={collapsed}
              active={
                firstPath === menu.pathname ||
                menu.extraMatchNavMenuActivePathnames?.includes?.(
                  router.pathname,
                ) ||
                isChildActive(menu?.items, router.pathname)
              }
              extra={
                <span>
                  <ArrowDown
                    className={cn(
                      submenuVisible && "rotate-180",
                      "[&_path]:stroke-navigationTextTertiary",
                    )}
                  />
                </span>
              }
              hoverTooltipLabel={false}
            />
          </HoverCard.Trigger>

          {collapsed && !sm && (
            <HoverCard.Content side="right" align="start" alignOffset={-8}>
              <HoverMenuItem menu={menu} />
            </HoverCard.Content>
          )}
        </HoverCard.Root>
      </li>
      {menu.items?.length > 0 && (
        <SubMenuItems
          className={cn(
            submenuVisible ? "block" : "hidden",
            padSubMenuItems && "pl-10 pb-2",
          )}
          items={menu.items}
        />
      )}
    </ul>
  );
}

function SubMenuItems({ className = "", items = [] }) {
  const router = useRouter();
  const routePath = router.asPath.split("?")[0];

  return (
    <ul className={className}>
      {items.map((item, idx) => {
        const matchActivePathnames = [
          ...(item?.extraMatchNavMenuActivePathnames ?? []),
          item.pathname,
        ];

        const active =
          matchActivePathnames.includes(router.pathname) ||
          matchActivePathnames.includes(routePath);

        return (
          <li key={idx} className="w-full flex items-center">
            {item?.type === "divider" ? (
              <NavMenuDivider className="my-4 mx-3" />
            ) : (
              <>
                <div className="ml-1 w-1 h-1 rounded-full bg-textSecondary" />
                <NavMenuItemItem
                  item={item}
                  items={item.items}
                  active={active}
                  className={cn(
                    "bg-transparent",
                    active && "bg-transparent text-theme500",
                  )}
                />
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
}
