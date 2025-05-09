import { MenuAdvanced } from "@osn/icons/subsquare";

export default function getAdvancedMenu(advanceMenu = []) {
  return advanceMenu.length
    ? {
        name: "Advanced",
        value: "advanced",
        type: "advanced",
        icon: <MenuAdvanced />,
        items: advanceMenu.map((item) => {
          delete item.icon;
          return item;
        }),
      }
    : null;
}
