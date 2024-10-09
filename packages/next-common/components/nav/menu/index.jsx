import { ArrowCircleLeft } from "@osn/icons/subsquare";
import { useNavCollapsed } from "next-common/context/nav";
import { usePageProps } from "next-common/context/page";
import { getNavMenu } from "next-common/utils/consts/menu";
import { createStateContext } from "react-use";
import NavMenuDivider from "../divider";
import NavMenuEntrance from "./entrance";
import NavMenuItem from "./item";

const [useNavMenuView, NavMenuViewProvider] = createStateContext({
  view: "main",
  menu: null,
});

export { useNavMenuView };

export default function NavMenu() {
  return (
    <NavMenuViewProvider>
      <NavMenuImpl />
    </NavMenuViewProvider>
  );
}

function NavMenuImpl() {
  const [collapsed] = useNavCollapsed();

  const [{ view }] = useNavMenuView();

  return (
    <>
      {view === "main" && <MainMenu collapsed={collapsed} />}
      {view === "subspace" && <SubSpaceMenu collapsed={collapsed} />}
    </>
  );
}

function MainMenu({ collapsed }) {
  const { tracks, fellowshipTracks, summary, detail, ambassadorTracks } =
    usePageProps();

  const menu = getNavMenu({
    tracks,
    fellowshipTracks,
    ambassadorTracks,
    summary,
    currentTrackId: detail?.track,
  });

  return (
    <div>
      {menu.map((m) => (
        <NavMenuEntrance key={m.name} {...m} collapsed={collapsed} />
      ))}
    </div>
  );
}

function SubSpaceMenu({ collapsed }) {
  const [{ menu }, setNavMenuView] = useNavMenuView();

  return (
    <div>
      <ul>
        <li>
          <NavMenuItem
            item={{
              icon: <ArrowCircleLeft />,
              name: "Back",
            }}
            onClick={() => {
              setNavMenuView({ view: "main" });
            }}
            collapsed={collapsed}
          />
        </li>
      </ul>

      <NavMenuDivider />

      {menu?.map((m) => (
        <NavMenuEntrance key={m.name} {...m} collapsed={collapsed} />
      ))}
    </div>
  );
}
