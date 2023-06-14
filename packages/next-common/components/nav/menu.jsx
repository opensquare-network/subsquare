import clsx from "clsx";
import { partition, capitalize, noop } from "lodash";
import { useIsMacOS, usePageProps } from "next-common/context/page";
import { getHomeMenu } from "next-common/utils/consts/menu";
import { useRouter } from "next/router";
import Link from "next/link";
import { isExternalLink } from "next-common/utils";
import { useChain } from "next-common/context/chain";
import { useToggle } from "usehooks-ts";
import tw from "tailwind-styled-components";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCmdkPaletteVisible } from "next-common/store/reducers/cmdkSlice";
import { MenuNavigation, ArrowDown } from "@osn/icons/subsquare";

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
              icon={item.iconV2}
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
                  "text12Medium text-textTertiaryContrast",
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
        <MenuItem
          onClick={childMenuToggle}
          icon={menu.icon}
          label={capitalize(menu.name)}
          extra={
            <span>
              <ArrowDown
                className={clsx(
                  childMenuVisible && "rotate-180",
                  "[&_path]:stroke-textTertiaryContrast [&_path]:!fill-transparent",
                )}
              />
            </span>
          }
        />
      </li>
      {!!menu.items?.length && (
        <ul className={clsx(childMenuVisible ? "block" : "hidden", "pl-9")}>
          {menu.items.map((item, idx) => (
            <li key={idx}>
              {item?.type === "divider" ? (
                <Divider />
              ) : (
                <MenuItem
                  label={item.name}
                  link={item.pathname}
                  icon={item.iconV2}
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
        "h-10 flex p-2 gap-x-3 items-center rounded-lg cursor-pointer text14Medium",
        "hover:text-theme500 [&_svg_path]:fill-textSecondaryContrast [&_svg_path]:hover:fill-theme500",
        active &&
          "text-theme500 bg-navigationActive [&_svg_path]:!fill-theme500",
      )}
    >
      {icon}
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
            <span className="ml-1 text-textTertiaryContrast">↗</span>
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
      return m;
    })
    .filter(Boolean);

  return {
    commonMenu,
    featuredMenu,
  };
}
