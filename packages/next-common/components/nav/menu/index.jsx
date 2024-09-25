import NavCommonMenu from "./common";
import NavMenuDivider from "../divider";
import NavFeaturedMenu from "./featured";
import NavArchivedMenu from "./archived";
import { ArrowCircleLeft } from "@osn/icons/subsquare";
import NavMenuItem from "./item";
import { getNavMenu } from "next-common/utils/consts/menu";
import { useDispatch, useSelector } from "react-redux";
import {
  navMenuShowMainMenuSelector,
  setMenuShowMainMenu,
} from "next-common/store/reducers/navSlice";
import { usePageProps } from "next-common/context/page";

export default function NavMenu({ collapsed }) {
  const { tracks, fellowshipTracks, summary, detail, ambassadorTracks } =
    usePageProps();
  const showMainMenu = useSelector(navMenuShowMainMenuSelector);
  const showArchivedMenu = !showMainMenu;

  const { featuredMenu, archivedMenu, moreMenu } = getNavMenu({
    tracks,
    fellowshipTracks,
    ambassadorTracks,
    summary,
    currentTrackId: detail?.track,
  });

  return (
    <div>
      {showMainMenu && (
        <MainMenu
          collapsed={collapsed}
          featuredMenu={featuredMenu}
          moreMenu={moreMenu}
          hasArchivedMenu={!!archivedMenu?.length}
        />
      )}

      {showArchivedMenu && (
        <ArchivedMenu collapsed={collapsed} archivedMenu={archivedMenu} />
      )}
    </div>
  );
}

function MainMenu({ collapsed, featuredMenu = [], moreMenu = [] }) {
  return (
    <>
      <NavCommonMenu collapsed={collapsed} />

      {featuredMenu.length > 0 && (
        <>
          <NavMenuDivider />
          <NavFeaturedMenu collapsed={collapsed} menu={featuredMenu} />
        </>
      )}

      <>
        <NavMenuDivider />
        <NavFeaturedMenu collapsed={collapsed} menu={[moreMenu]} />
      </>
    </>
  );
}

function ArchivedMenu({ collapsed, archivedMenu = [] }) {
  const dispatch = useDispatch();

  return (
    <>
      <ul>
        <li>
          <NavMenuItem
            item={{
              icon: <ArrowCircleLeft />,
              name: "Back",
            }}
            onClick={() => {
              dispatch(setMenuShowMainMenu(true));
            }}
            collapsed={collapsed}
          />
        </li>
      </ul>

      <NavMenuDivider />

      <NavArchivedMenu collapsed={collapsed} menu={archivedMenu} />
    </>
  );
}
