import { usePageProps } from "next-common/context/page";
import { getFeaturedMenu } from "next-common/utils/consts/menu";
import { useNavSubmenuVisible } from "next-common/context/nav";
import NavMenuGroup from "./group";
import NavMenuItem from "./item";
import { useRouter } from "next/router";

export default function NavFeaturedMenu({ collapsed }) {
  const { tracks, fellowshipTracks, summary, detail } = usePageProps();
  const featuredMenu = getFeaturedMenu({
    summary,
    tracks,
    fellowshipTracks,
    currentTrackId: detail?.track,
  });
  const [navSubmenuVisible, setNavSubmenuVisible] = useNavSubmenuVisible();

  const router = useRouter();

  return (
    <ul>
      {featuredMenu?.map((menu) => (
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
                active={router.asPath === menu.pathname}
                collapsed={collapsed}
              />
            ))}
        </li>
      ))}
    </ul>
  );
}
