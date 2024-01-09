import { cn } from "next-common/utils";
import { startCase, capitalize } from "lodash";
import { useRouter } from "next/router";
import { useState } from "react";
import { ArrowDown } from "@osn/icons/subsquare";
import * as HoverCard from "@radix-ui/react-hover-card";
import { useScreenSize } from "next-common/utils/hooks/useScreenSize";
import { useUpdateEffect } from "usehooks-ts";
import NavMenuItem from "./item";
import NavMenuDivider from "../divider";
import sumBy from "lodash.sumby";

export default function NavMenuGroup({
  menu = {},
  collapsed,
  navSubmenuVisible,
  setNavSubmenuVisible,
}) {
  const { sm } = useScreenSize();
  const router = useRouter();
  const firstPath = "/" + router.asPath.split("/").filter(Boolean)[0];

  const [submenuVisible, setSubmenuVisible] = useState(
    collapsed
      ? false
      : firstPath === menu.pathname || navSubmenuVisible[menu.name],
  );

  useUpdateEffect(() => {
    setSubmenuVisible(
      collapsed
        ? false
        : firstPath === menu.pathname || navSubmenuVisible[menu.name],
    );
  }, [collapsed]);

  function toggleChildMenu() {
    if (collapsed) {
      return;
    }

    setSubmenuVisible(!submenuVisible);

    setNavSubmenuVisible({
      ...navSubmenuVisible,
      [menu.name]: !submenuVisible,
    });
  }

  return (
    <ul>
      <li>
        <HoverCard.Root openDelay={0} closeDelay={0}>
          <HoverCard.Trigger>
            <NavMenuItem
              onClick={toggleChildMenu}
              icon={menu.icon}
              label={startCase(capitalize(menu.name))}
              activeCount={
                sumBy(menu?.items, "activeCount") ?? menu.activeCount
              }
              collapsed={collapsed}
              active={firstPath === menu.pathname}
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
              <div className="pl-6">
                <div className="py-2.5 px-4 bg-navigationBg w-[268px] rounded-lg max-h-screen overflow-y-scroll scrollbar-pretty border border-navigationBorder">
                  <NavMenuItem
                    label={startCase(capitalize(menu.name))}
                    activeCount={
                      sumBy(menu?.items, "activeCount") ?? menu.activeCount
                    }
                    className="pointer-events-none"
                  />
                  <NavMenuDivider />
                  <SubMenuItems items={menu.items} />
                </div>
              </div>
            </HoverCard.Content>
          )}
        </HoverCard.Root>
      </li>
      {!!menu.items?.length && (
        <SubMenuItems
          className={cn(submenuVisible ? "block" : "hidden", "pl-9")}
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
          <li key={idx}>
            {item?.type === "divider" ? (
              <NavMenuDivider />
            ) : (
              <NavMenuItem
                label={item.name}
                link={item.pathname}
                icon={item.icon}
                activeCount={item.activeCount}
                active={active}
                className={active && "bg-transparent"}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}
