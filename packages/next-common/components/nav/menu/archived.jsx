import { usePageProps } from "next-common/context/page";
import { getArchivedMenu } from "next-common/utils/consts/menu";
import { useNavSubmenuVisible } from "next-common/context/nav";
import NavMenuGroup from "./group";

export default function NavArchivedMenu({ collapsed }) {
  const { tracks, fellowshipTracks } = usePageProps();
  const [navSubmenuVisible, setNavSubmenuVisible] = useNavSubmenuVisible();
  const archivedMenu = getArchivedMenu({ tracks, fellowshipTracks });

  return (
    <ul>
      {archivedMenu?.map((menu) => (
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
