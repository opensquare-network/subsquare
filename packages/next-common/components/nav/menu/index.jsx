import { ArrowCircleLeft } from "@osn/icons/subsquare";
import { usePageProps } from "next-common/context/page";
import { getMainMenu } from "next-common/utils/consts/menu";
import NavMenuItem from "./item";
import { useRouter } from "next/router";
import { useNavMenuType } from "next-common/context/nav";
import { NAV_MENU_TYPE } from "next-common/utils/constants";

export default function NavMenu({ collapsed }) {
  const [navMenuType, setNavMenuType] = useNavMenuType();
  const { tracks, fellowshipTracks, summary, detail, ambassadorTracks } =
    usePageProps();

  const router = useRouter();

  const mainMenu = getMainMenu({
    tracks,
    fellowshipTracks,
    ambassadorTracks,
    summary,
    currentTrackId: detail?.track,
  });

  let menu = [];
  if (navMenuType.type === NAV_MENU_TYPE.main) {
    menu = mainMenu;
  } else if (navMenuType.type === NAV_MENU_TYPE.subspace) {
    menu = [
      {
        name: "Back",
        icon: <ArrowCircleLeft />,
        onClick() {
          router.push("/");
        },
      },
      { type: "divider" },
      ...(navMenuType.menu || []),
    ];
  } else if (navMenuType.type === NAV_MENU_TYPE.archived) {
    menu = [
      {
        name: "Back",
        icon: <ArrowCircleLeft />,
        onClick() {
          setNavMenuType({ type: NAV_MENU_TYPE.main, menu: null });
        },
      },
      { type: "divider" },
      ...(navMenuType.menu || []),
    ];
  }

  return (
    <ul>
      <li>
        {menu.map((m, idx) => (
          <NavMenuItem
            key={`${m.value || ""}-${idx}`}
            {...m}
            collapsed={collapsed}
          />
        ))}
      </li>
    </ul>
  );
}
