import { MenuAdvanced } from "@osn/icons/subsquare";

export default function getAdvancedMenu(advanceMenu = []) {
  return {
    name: "Advanced",
    value: "advanced",
    type: "advanced",
    icon: <MenuAdvanced />,
    items: advanceMenu,
  };
}
