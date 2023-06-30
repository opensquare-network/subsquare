import { usePageProps } from "next-common/context/page";
import { getFeaturedMenu } from "next-common/utils/consts/menu";
import { useNavSubmenuVisible } from "next-common/context/nav";
import NavMenuGroup from "./group";

export default function NavFeaturedMenu({ collapsed }) {
  const { tracks, fellowshipTracks } = usePageProps();
  const featuredMenu = getFeaturedMenu({ tracks, fellowshipTracks });
  const [navSubmenuVisible, setNavSubmenuVisible] = useNavSubmenuVisible();

  return (
    <ul>
      {featuredMenu?.map((menu) => (
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
