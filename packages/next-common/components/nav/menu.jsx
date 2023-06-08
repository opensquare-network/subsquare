import clsx from "clsx";
import { partition, capitalize } from "lodash";
import { usePageProps } from "next-common/context/page";
import { getHomeMenu } from "next-common/utils/consts/menu";
import { useRouter } from "next/router";
import Link from "next/link";
import { isExternalLink } from "next-common/utils";
import { useChain } from "next-common/context/chain";
import { useToggle } from "usehooks-ts";
import tw from "tailwind-styled-components";
import { useEffect } from "react";

export default function NavMenu({ collapsed }) {
  const { commonMenu, featuredMenu } = useMenu();
  const router = useRouter();

  return (
    <div>
      <ul>
        {commonMenu?.[0]?.items?.map?.((item) => (
          <li key={item.value}>
            <MenuItem
              item={item}
              active={item.pathname === router.asPath}
              collapsed={collapsed}
            />
          </li>
        ))}
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

const MenuItemWrapper = tw.div`
h-10 flex p-2 gap-x-3 items-center rounded-lg cursor-pointer text14Medium
hover:text-theme500 [&_svg_path]:hover:fill-theme500
${(p) =>
  p.$active && "text-theme500 bg-navigationActive [&_svg_path]:!fill-theme500"}
`;
function MenuGroup({ menu = [], collapsed }) {
  // FIXME: v2 read cookie
  const [childCollapsed, childToggle, setChildCollapsed] = useToggle(false);
  console.log(menu);

  useEffect(() => {
    if (collapsed) {
      setChildCollapsed(true);
    }
  }, [collapsed]);

  return (
    <ul>
      <li>
        <MenuItemWrapper
          role="button"
          className="flex items-center justify-between w-full h-full"
          onClick={childToggle}
        >
          {capitalize(menu.name)}
          <div>=</div>
        </MenuItemWrapper>
      </li>
      {!!menu.items?.length && (
        <ul className={clsx(!childCollapsed ? "block" : "hidden", "pl-7")}>
          {menu.items.map((item) => (
            <li key={item.value}>
              <MenuItem item={item} collapsed={collapsed} />
            </li>
          ))}
        </ul>
      )}
    </ul>
  );
}

function MenuItem({ active, item, collapsed }) {
  const isExternal = isExternalLink(item.pathname);

  if (item?.type === "divider") {
    return <Divider />;
  }

  return (
    <Link href={item.pathname || ""} target={isExternal ? "_blank" : "_self"}>
      <MenuItemWrapper $active={active}>
        {item.icon}
        <span className={clsx(collapsed && "hidden")}>
          {item.name}{" "}
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
