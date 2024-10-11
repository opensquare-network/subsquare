import { ArrowCircleLeft } from "@osn/icons/subsquare";
import { useNavCollapsed } from "next-common/context/nav";
import { usePageProps } from "next-common/context/page";
import { getMainMenu } from "next-common/utils/consts/menu";
import { createGlobalState } from "react-use";
import NavMenuItem from "./item";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const useNavMenuView = createGlobalState({
  view: "main",
  menu: null,
});

export default function NavMenu() {
  const [collapsed] = useNavCollapsed();
  const [navMenuView, setNavMenuView] = useNavMenuView();
  const { tracks, fellowshipTracks, summary, detail, ambassadorTracks } =
    usePageProps();

  const router = useRouter();
  useEffect(() => {
    if (router.pathname === "/") {
      setNavMenuView({ view: "main" });
    }
  }, [router.pathname]);

  const mainMenu = getMainMenu({
    tracks,
    fellowshipTracks,
    ambassadorTracks,
    summary,
    currentTrackId: detail?.track,
  });

  let menu = [];
  if (navMenuView.view === "main") {
    menu = mainMenu;
  } else if (navMenuView.view === "subspace") {
    menu = [
      {
        name: "Back",
        icon: <ArrowCircleLeft />,
        onClick() {
          setNavMenuView({ view: "main" });
        },
      },
      { type: "divider" },
      ...(navMenuView.menu || []),
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
