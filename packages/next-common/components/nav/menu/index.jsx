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
import { getArchivedMenu } from "next-common/utils/consts/menu";
import { useDispatch, useSelector } from "react-redux";
import {
  navMenuShowMainMenuSelector,
  setMenuShowMainMenu,
} from "next-common/store/reducers/navSlice";

export default function NavMenu({ collapsed }) {
  const showMainMenu = useSelector(navMenuShowMainMenuSelector);
  const showArchivedMenu = !showMainMenu;

  return (
    <div>
      {showMainMenu && <MainMenu collapsed={collapsed} />}

      {showArchivedMenu && <ArchivedMenu collapsed={collapsed} />}
    </div>
  );
}

function MainMenu({ collapsed }) {
  const archivedMenu = getArchivedMenu({});

  return (
    <>
      <NavCommonMenu collapsed={collapsed} />

      <NavMenuDivider />
      <NavFeaturedMenu collapsed={collapsed} />

      {!!archivedMenu?.length && (
        <>
          <NavMenuDivider />
          <ArchivedMenuButton collapsed={collapsed} />
        </>
      )}
    </>
  );
}

function ArchivedMenu({ collapsed }) {
  const dispatch = useDispatch();

  return (
    <>
      <ul>
        <li>
          <NavMenuItem
            icon={<ArrowCircleLeft />}
            label="Back"
            onClick={() => {
              dispatch(setMenuShowMainMenu(true));
            }}
            collapsed={collapsed}
          />
        </li>
      </ul>

      <NavMenuDivider />

      <NavArchivedMenu collapsed={collapsed} />
    </>
  );
}

function ArchivedMenuButton({ collapsed }) {
  const dispatch = useDispatch();

  return (
    <ul>
      <li>
        <NavMenuItem
          collapsed={collapsed}
          icon={<MenuArchived />}
          label="Archived"
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
