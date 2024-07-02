import NavCommonMenu from "./common";
import NavMenuDivider from "../divider";
import NavFeaturedMenu from "./featured";
import NavArchivedMenu from "./archived";
import {
  ArrowCircleLeft,
  ArrowRight,
  MenuArchived,
} from "@osn/icons/subsquare";
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

  const { featuredMenu, archivedMenu } = getNavMenu({
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
          hasArchivedMenu={!!archivedMenu?.length}
        />
      )}

      {showArchivedMenu && (
        <ArchivedMenu collapsed={collapsed} archivedMenu={archivedMenu} />
      )}
    </div>
  );
}

function MainMenu({ collapsed, featuredMenu = [], hasArchivedMenu = false }) {
  return (
    <>
      <NavCommonMenu collapsed={collapsed} />

      <NavMenuDivider />
      <NavFeaturedMenu collapsed={collapsed} menu={featuredMenu} />

      {hasArchivedMenu && (
        <>
          <NavMenuDivider />
          <ArchivedMenuButton collapsed={collapsed} />
        </>
      )}
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

function ArchivedMenuButton({ collapsed }) {
  const dispatch = useDispatch();

  return (
    <ul>
      <li>
        <NavMenuItem
          item={{
            icon: <MenuArchived />,
            name: "Archived",
          }}
          collapsed={collapsed}
          onClick={() => {
            dispatch(setMenuShowMainMenu(false));
          }}
          extra={
            <ArrowRight className="[&_path]:stroke-navigationTextTertiary" />
          }
        />
      </li>
    </ul>
  );
}
