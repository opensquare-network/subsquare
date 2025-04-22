import { MenuMore } from "@osn/icons/subsquare";

export default function getAdvancedMenu(advanceMenu = []) {
  return {
    name: "Advanced",
    value: "advanced",
    type: "advanced",
    icon: <MenuMore />,
    items: advanceMenu,
  };
}
