import { useRouter } from "next/router";
import NavMenuItemGroup from "./group";
import NavMenuItemItem from "./item";
import NavMenuDivider from "../../divider";
import { useNavSubmenuVisible } from "next-common/context/nav";

export default function NavMenuItem({ collapsed, ...menu } = {}) {
  const { type, items } = menu || {};
  const router = useRouter();
  const routePathname = router.asPath.split("?")[0];
  const [navSubmenuVisible, setNavSubmenuVisible] = useNavSubmenuVisible();

  if (type === "divider") {
    return <NavMenuDivider />;
  }

  if (type === "subspace") {
    return <NavMenuItemItem item={menu} collapsed={collapsed} />;
  }

  if (items?.length) {
    return (
      <NavMenuItemGroup
        menu={menu}
        collapsed={collapsed}
        navSubmenuVisible={navSubmenuVisible}
        setNavSubmenuVisible={setNavSubmenuVisible}
      />
    );
  } else {
    return (
      <NavMenuItemItem
        item={menu}
        active={
          menu.pathname === routePathname ||
          menu?.extraMatchNavMenuActivePathnames?.includes?.(router.pathname)
        }
        collapsed={collapsed}
      />
    );
  }
}
