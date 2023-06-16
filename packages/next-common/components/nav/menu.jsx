import clsx from "clsx";
import { partition, capitalize, noop } from "lodash";
import { useIsMacOS, usePageProps } from "next-common/context/page";
import { getHomeMenu } from "next-common/utils/consts/menu";
import { useRouter } from "next/router";
import Link from "next/link";
import { isExternalLink } from "next-common/utils";
import { useChain } from "next-common/context/chain";
import { useToggle, useUpdateEffect } from "usehooks-ts";
import tw from "tailwind-styled-components";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCmdkPaletteVisible } from "next-common/store/reducers/cmdkSlice";
import { MenuNavigation, ArrowDown } from "@osn/icons/subsquare";
import * as HoverCard from "@radix-ui/react-hover-card";
import { useScreenSize } from "next-common/utils/hooks/useScreenSize";
import { useNavSubmenuVisible } from "next-common/context/nav";
import { clone } from "lodash";

export default function NavMenu({ collapsed }) {
  const dispatch = useDispatch();
  const { featuredMenu, baseMenu } = useMenu();
  const router = useRouter();
  const isMacOS = useIsMacOS();
  const [submenuVisible, setSubmenuVisible] = useNavSubmenuVisible();

  return (
    <div>
      <ul>
        {baseMenu?.map?.((item) => (
          <li key={item.value}>
            <MenuItem
              icon={item.icon}
              label={item.name}
              link={item.pathname}
              active={item.pathname === router.asPath}
              collapsed={collapsed}
            />
          </li>
        ))}
        <li>
          <MenuItem
            onClick={() => {
              dispatch(setCmdkPaletteVisible(true));
            }}
            icon={<MenuNavigation />}
            label="Navigation"
            collapsed={collapsed}
            extra={
              <span
                className={clsx(
                  "bg-navigationActive rounded py-0.5 px-2",
                  "text12Medium text-navigationTextTertiary",
                )}
              >
                {isMacOS ? "⌘" : "Ctrl +"} K
              </span>
            }
          />
        </li>
      </ul>

      <Divider />

      <ul>
        {featuredMenu?.map((menu) => (
          <li key={menu.name}>
            {menu.name && menu.items && (
              <MenuGroup
                menu={menu}
                collapsed={collapsed}
                submenuVisible={submenuVisible}
                setSubmenuVisible={setSubmenuVisible}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

const ActiveCountLabel = tw.span`
ml-2 text-textTertiaryContrast
`;

function MenuGroup({
  menu = {},
  collapsed,
  submenuVisible,
  setSubmenuVisible,
}) {
  const { sm } = useScreenSize();

  const [childMenuVisible, childMenuToggler, setChildMenuVisible] = useToggle(
    !!submenuVisible[menu.name],
  );

  useEffect(() => {
    if (collapsed) {
      setChildMenuVisible(false);
    } else {
      setChildMenuVisible(submenuVisible[menu.name]);
    }
  }, [collapsed]);

  useUpdateEffect(() => {
    setSubmenuVisible({
      ...submenuVisible,
      [menu.name]: childMenuVisible,
    });
  }, [childMenuVisible]);

  function toggleChildMenu() {
    if (collapsed) {
      return;
    }

    childMenuToggler();
  }

  return (
    <ul>
      <li>
        <HoverCard.Root openDelay={0} closeDelay={0}>
          <HoverCard.Trigger>
            <MenuItem
              onClick={toggleChildMenu}
              icon={menu.icon}
              label={capitalize(menu.name)}
              activeCount={menu.activeCount}
              collapsed={collapsed}
              extra={
                <span>
                  <ArrowDown
                    className={clsx(
                      childMenuVisible && "rotate-180",
                      "[&_path]:stroke-navigationTextTertiary [&_path]:!fill-transparent",
                    )}
                  />
                </span>
              }
            />
          </HoverCard.Trigger>

          {collapsed && !sm && (
            <HoverCard.Content side="right" align="start">
              <div className="pl-6">
                <div className="py-2.5 px-4 bg-navigationBg w-[268px] rounded-lg max-h-screen overflow-y-scroll">
                  <SubMenuItems items={menu.items} />
                </div>
              </div>
            </HoverCard.Content>
          )}
        </HoverCard.Root>
      </li>
      {!!menu.items?.length && (
        <SubMenuItems
          className={clsx(childMenuVisible ? "block" : "hidden", "pl-9")}
          items={menu.items}
        />
      )}
    </ul>
  );
}

function SubMenuItems({ className = "", items = [] }) {
  return (
    <ul className={className}>
      {items.map((item, idx) => (
        <li key={idx}>
          {item?.type === "divider" ? (
            <Divider />
          ) : (
            <MenuItem
              label={item.name}
              link={item.pathname}
              icon={item.icon}
              activeCount={item.activeCount}
            />
          )}
        </li>
      ))}
    </ul>
  );
}

function MenuItem({
  active,
  collapsed,
  icon,
  label,
  activeCount,
  extra,
  link,
  onClick = noop,
}) {
  const isExternal = isExternalLink(link);

  let content = (
    <div
      onClick={onClick}
      className={clsx(
        "text-navigationText",
        "h-10 flex p-2 gap-x-3 items-center rounded-lg cursor-pointer text14Medium",
        "hover:text-theme500 [&_svg_path]:fill-navigationIcon [&_svg_path]:hover:fill-theme500",
        active &&
          "text-theme500 bg-navigationActive [&_svg_path]:!fill-theme500",
      )}
    >
      {icon && <span className="w-6 h-6">{icon}</span>}
      <span
        className={clsx(
          collapsed && "hidden",
          "w-full inline-flex justify-between items-center",
        )}
      >
        <span>
          {label}{" "}
          {!!activeCount && <ActiveCountLabel>{activeCount}</ActiveCountLabel>}
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

function Divider() {
  return <hr className="h-[1px] bg-navigationBorder my-4 mx-3" />;
}

function useMenu() {
  const chain = useChain();
  const props = usePageProps();
  const { tracks, fellowshipTracks } = props;
  const menu = getHomeMenu({ tracks, fellowshipTracks });

  let [commonMenu, rest] = partition(menu, (item) => !item.name);
  const featuredMenu = rest
    .map((m) => {
      if (m?.excludeToChains?.includes?.(chain)) {
        return null;
      }

      m.items =
        m.items?.filter?.((i) => !i?.excludeToChains?.includes?.(chain)) ?? [];

      // TODO: v2, remove iconv2 compat
      m.items = m.items?.map?.((item) => {
        item.icon = item.iconV2;
        return item;
      });
      return m;
    })
    .filter(Boolean);

  // TODO: v2, remove iconv2 compat
  const baseMenu = commonMenu?.[0]?.items?.map?.((item) => {
    const clonedItem = clone(item);
    if (clonedItem.iconV2) {
      clonedItem.icon = clonedItem.iconV2;
    }
    return clonedItem;
  });

  return {
    baseMenu,
    featuredMenu,
  };
}
