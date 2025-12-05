import { ArrowRight, MenuArchived } from "@osn/icons/subsquare";
import { NAV_MENU_TYPE } from "next-common/utils/constants";

export default function getArchivedMenu(archivedMenu = []) {
  return archivedMenu?.length
    ? [
        {
          value: "archived",
          name: "Archived",
          type: NAV_MENU_TYPE.archived,
          icon: <MenuArchived />,
          extra: <ArrowRight className="text-navigationTextTertiary" />,
          items: archivedMenu,
        },
      ]
    : [];
}
