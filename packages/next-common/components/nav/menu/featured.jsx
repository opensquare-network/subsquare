import { useNavSubmenuVisible } from "next-common/context/nav";
import NavMenuGroup from "./group";
import NavMenuItem from "./item";
import { usePageUrl } from "next-common/context/nav/route";

export default function NavFeaturedMenu({ collapsed, menu = [] }) {
  const [navSubmenuVisible, setNavSubmenuVisible] = useNavSubmenuVisible();

  const pageUrl = usePageUrl();

  return (
    <ul>
      {menu?.map((menu) => (
        <li key={menu.name}>
          {menu.name &&
            (menu.items ? (
              <NavMenuGroup
                menu={menu}
                collapsed={collapsed}
                navSubmenuVisible={navSubmenuVisible}
                setNavSubmenuVisible={setNavSubmenuVisible}
              />
            ) : (
              <NavMenuItem
                label={menu.name}
                link={menu.pathname}
                icon={menu.icon}
                activeCount={menu.activeCount}
                active={pageUrl === menu.pathname}
                collapsed={collapsed}
              />
            ))}
        </li>
      ))}
    </ul>
  );
}
