import { MenuAdvanced } from "@osn/icons/subsquare";
import omit from "lodash-es/omit";

export default function getAdvancedMenu(advanceMenu = []) {
  return advanceMenu.length
    ? {
        name: "Advanced",
        value: "advanced",
        type: "advanced",
        icon: <MenuAdvanced />,
        items: advanceMenu.map((item) => {
          return omit(item, "icon");
        }),
      }
    : null;
}
