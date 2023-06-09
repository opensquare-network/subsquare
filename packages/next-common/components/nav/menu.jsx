import clsx from "clsx";
import { partition, capitalize } from "lodash";
import { useIsMacOS, usePageProps } from "next-common/context/page";
import { getHomeMenu } from "next-common/utils/consts/menu";
import { useRouter } from "next/router";
import Link from "next/link";
import { isExternalLink } from "next-common/utils";
import { useChain } from "next-common/context/chain";
import { useToggle } from "usehooks-ts";
import tw from "tailwind-styled-components";
import { useEffect } from "react";
import ArrowDownIcon from "next-common/assets/imgs/icons/arrow-down.svg";
import { useDispatch } from "react-redux";
import { setCmdkPaletteVisible } from "next-common/store/reducers/cmdkSlice";

const MenuItemWrapper = tw.div`
h-10 flex p-2 gap-x-3 items-center rounded-lg cursor-pointer text14Medium
hover:text-theme500 [&_svg_path]:hover:fill-theme500
${(p) =>
  p.$active && "text-theme500 bg-navigationActive [&_svg_path]:!fill-theme500"}
`;

export default function NavMenu({ collapsed }) {
  const dispatch = useDispatch();
  const { commonMenu, featuredMenu } = useMenu();
  const router = useRouter();
  const isMacOS = useIsMacOS();

  return (
    <div>
      <ul>
        {commonMenu?.[0]?.items?.map?.((item) => (
          <li key={item.value}>
            <MenuItem
              icon={item.icon}
              label={item.name}
              url={item.pathname}
              active={item.pathname === router.asPath}
              collapsed={collapsed}
            />
          </li>
        ))}
        <li>
          <MenuItemWrapper
            role="menuitem"
            onClick={() => {
              dispatch(setCmdkPaletteVisible(true));
            }}
          >
            <span>icon</span>
            <span className="inline-flex justify-between items-center w-full">
              <span>Navigation</span>
              <span
                className={clsx(
                  "bg-navigationActive rounded",
                  "text12Medium text-textTertiaryContrast",
                )}
              >
                {isMacOS ? "⌘" : "Ctrl +"} K
              </span>
            </span>
          </MenuItemWrapper>
        </li>
      </ul>

      <Divider />

      <ul>
        {featuredMenu?.map((menu) => (
          <li key={menu.name}>
            {menu.name && menu.items && (
              <MenuGroup menu={menu} collapsed={collapsed} />
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

function MenuGroup({ menu = [], collapsed }) {
  // FIXME: v2 read cookie
  const [childMenuVisible, childMenuToggle, setChildMenuVisible] =
    useToggle(false);

  useEffect(() => {
    if (collapsed) {
      setChildMenuVisible(false);
    }
  }, [collapsed]);

  return (
    <ul>
      <li>
        <MenuItemWrapper
          role="button"
          className="flex items-center justify-between w-full h-full"
          onClick={childMenuToggle}
        >
          <span>
            {capitalize(menu.name)}
            {!!menu.activeCount && (
              <ActiveCountLabel>{menu.activeCount}</ActiveCountLabel>
            )}
          </span>
          <div>
            <ArrowDownIcon
              className={clsx(
                childMenuVisible && "rotate-180",
                "[&_path]:!fill-transparent",
              )}
            />
          </div>
        </MenuItemWrapper>
      </li>
      {!!menu.items?.length && (
        <ul className={clsx(childMenuVisible ? "block" : "hidden", "pl-7")}>
          {menu.items.map((item, idx) => (
            <li key={idx}>
              {item?.type === "divider" ? (
                <Divider />
              ) : (
                <MenuItem
                  label={item.name}
                  url={item.pathname}
                  icon={item.icon}
                  activeCount={item.activeCount}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </ul>
  );
}

function MenuItem({ active, collapsed, icon, label, url, activeCount }) {
  const isExternal = isExternalLink(url);

  return (
    <Link href={url || ""} target={isExternal ? "_blank" : "_self"}>
      <MenuItemWrapper $active={active}>
        {icon}
        <span className={clsx(collapsed && "hidden", "w-full")}>
          {label}{" "}
          {!!activeCount && <ActiveCountLabel>{activeCount}</ActiveCountLabel>}
          {isExternal && (
            <span className="ml-1 text-textTertiaryContrast">↗</span>
          )}
        </span>
      </MenuItemWrapper>
    </Link>
  );
}

function Divider() {
  return <hr className="h-[1px] bg-navigationBorder my-4 mx-3" />;
}

function useMenu() {
  const chain = useChain();
  const props = usePageProps();
  const { tracks, fellowshipTracks } = props;
  const menu = getHomeMenu({ tracks, fellowshipTracks });

  const [commonMenu, rest] = partition(menu, (item) => !item.name);
  const featuredMenu = rest
    .map((m) => {
      if (m?.excludeToChains?.includes?.(chain)) {
        return null;
      }

      m.items =
        m.items?.filter?.((i) => !i?.excludeToChains?.includes?.(chain)) ?? [];
      return m;
    })
    .filter(Boolean);

  return {
    commonMenu,
    featuredMenu,
  };
}
