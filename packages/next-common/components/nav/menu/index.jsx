import NavCommonMenu from "./common";
import NavMenuDivider from "../divider";
import NavFeaturedMenu from "./featured";
import { useToggle } from "usehooks-ts";
import NavArchivedMenu from "./archived";
import {
  ArrowCircleLeft,
  ArrowRight,
  MenuArchived,
} from "@osn/icons/subsquare";
import NavMenuItem from "./item";
import { getArchivedMenu } from "next-common/utils/consts/menu";

export default function NavMenu({ collapsed }) {
  const [showMainMenu, toggleShowMainMenu] = useToggle(true);
  const showArchivedMenu = !showMainMenu;

  return (
    <div>
      {showMainMenu && (
        <MainMenu
          collapsed={collapsed}
          toggleShowMainMenu={toggleShowMainMenu}
        />
      )}

      {showArchivedMenu && (
        <ArchivedMenu
          collapsed={collapsed}
          toggleShowMainMenu={toggleShowMainMenu}
        />
      )}
    </div>
  );
}

function MainMenu({ collapsed, toggleShowMainMenu }) {
  const archivedMenu = getArchivedMenu({});

  return (
    <>
      <NavCommonMenu collapsed={collapsed} />

      <NavMenuDivider />
      <NavFeaturedMenu collapsed={collapsed} />

      {!!archivedMenu?.length && (
        <>
          <NavMenuDivider />
          <ArchivedMenuButton
            collapsed={collapsed}
            toggleShowMainMenu={toggleShowMainMenu}
          />
        </>
      )}
    </>
  );
}

function ArchivedMenu({ collapsed, toggleShowMainMenu }) {
  return (
    <>
      <ul>
        <li>
          <NavMenuItem
            icon={<ArrowCircleLeft />}
            label="Back"
            onClick={toggleShowMainMenu}
            collapsed={collapsed}
          />
        </li>
      </ul>

      <NavMenuDivider />

      <NavArchivedMenu collapsed={collapsed} />
    </>
  );
}

function ArchivedMenuButton({ collapsed, toggleShowMainMenu }) {
  return (
    <ul>
      <li>
        <NavMenuItem
          collapsed={collapsed}
          icon={<MenuArchived />}
          label="Archived"
          onClick={toggleShowMainMenu}
          extra={
            <ArrowRight className="[&_path]:stroke-navigationTextTertiary" />
          }
        />
      </li>
    </ul>
  );
}
