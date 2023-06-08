import clsx from "clsx";
import { partition } from "lodash";
import { usePageProps } from "next-common/context/page";
import { getHomeMenu } from "next-common/utils/consts/menu";
import { useRouter } from "next/router";
import Link from "next/link";
import { isExternalLink } from "next-common/utils";

export default function NavMenu({ collapsed }) {
  const [commonMenu, featuredMenu] = useMenu();
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

      <hr className="h-[1px] bg-navigationBorder my-4 mx-3" />

      <ul>
        {featuredMenu?.map((menu) => (
          <li key={menu.name}></li>
        ))}
      </ul>
    </div>
  );
}

function MenuItem({ active, item, collapsed }) {
  const isExternal = isExternalLink(item.pathname);

  return (
    <div className="group/menu-item">
      <Link
        href={item.pathname}
        target={isExternal ? "_blank" : "_self"}
        className={clsx(
          "flex p-2 gap-x-3 items-center text14Medium h-10",
          "rounded-lg",
          active &&
            "text-theme500 bg-navigationActive [&_svg_path]:!fill-theme500",
          "hover:text-theme500",
          "group-hover/menu-item:[&_svg_path]:fill-theme500",
        )}
      >
        {item.icon}
        {!collapsed && (
          <span>
            {item.name}{" "}
            {isExternal && (
              <span className="ml-1 text-textTertiaryContrast">↗</span>
            )}
          </span>
        )}
      </Link>
    </div>
  );
}

function useMenu() {
  const props = usePageProps();
  const { tracks, fellowshipTracks } = props;
  const menu = getHomeMenu({ tracks, fellowshipTracks });

  return partition(menu, (item) => !item.name);
}
