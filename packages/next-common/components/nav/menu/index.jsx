import { ArrowCircleLeft } from "@osn/icons/subsquare";
import { usePageProps } from "next-common/context/page";
import { getMainMenu } from "next-common/utils/consts/menu";
import NavMenuItem from "./item";
import { useRouter } from "next/router";
import { useNavMenuView } from "next-common/context/nav";

export default function NavMenu({ collapsed }) {
  const navMenuView = useNavMenuView();
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
  if (navMenuView.view === "main") {
    menu = mainMenu;
  } else if (navMenuView.view === "subspace") {
    menu = [
      {
        name: "Back",
        icon: <ArrowCircleLeft />,
        onClick() {
          router.push("/");
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
