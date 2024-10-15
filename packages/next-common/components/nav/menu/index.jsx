import { ArrowCircleLeft } from "@osn/icons/subsquare";
import { usePageProps } from "next-common/context/page";
import { useMainMenu } from "next-common/utils/consts/menu";
import { createGlobalState } from "react-use";
import NavMenuItem from "./item";

export const useNavMenuView = createGlobalState({
  view: "main",
  menu: null,
});

export default function NavMenu({ collapsed }) {
  const [navMenuView, setNavMenuView] = useNavMenuView();
  const { tracks, fellowshipTracks, summary, detail, ambassadorTracks } =
    usePageProps();

  const mainMenu = useMainMenu({
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
