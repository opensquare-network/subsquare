import { useNavSubmenuVisible } from "next-common/context/nav";
import NavMenuGroup from "./group";

export default function NavArchivedMenu({ collapsed, menu = [] }) {
  const [navSubmenuVisible, setNavSubmenuVisible] = useNavSubmenuVisible();

  return (
    <ul>
      {menu?.map((menu) => (
        <li key={menu.name}>
          {menu.name && menu.items && (
            <NavMenuGroup
              menu={menu}
              collapsed={collapsed}
              navSubmenuVisible={navSubmenuVisible}
              setNavSubmenuVisible={setNavSubmenuVisible}
            />
          )}
        </li>
      ))}
    </ul>
  );
}
