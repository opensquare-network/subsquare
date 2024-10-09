import { useRouter } from "next/router";
import NavMenuGroup from "./group";
import NavMenuItem from "./item";
import NavMenuDivider from "../divider";
import { useNavSubmenuVisible } from "next-common/context/nav";

export default function NavMenuEntrance({ collapsed, ...menu } = {}) {
  const { type, items } = menu || {};
  const router = useRouter();
  const routePathname = router.asPath.split("?")[0];
  const [navSubmenuVisible, setNavSubmenuVisible] = useNavSubmenuVisible();

  if (type === "divider") {
    return <NavMenuDivider />;
  }

  if (items?.length) {
    return (
      <NavMenuGroup
        menu={menu}
        collapsed={collapsed}
        navSubmenuVisible={navSubmenuVisible}
        setNavSubmenuVisible={setNavSubmenuVisible}
      />
    );
  } else {
    return (
      <NavMenuItem
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
