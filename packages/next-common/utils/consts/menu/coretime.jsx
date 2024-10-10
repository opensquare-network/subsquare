import { ArrowRight, MenuCoretime, MenuOverview } from "@osn/icons/subsquare";

export const coretimeMenu = {
  name: "Coretime",
  value: "coretime",
  pathname: "/coretime",
  icon: <MenuCoretime />,
  extra: <ArrowRight className="text-navigationTextTertiary" />,
  type: "subspace",
  items: [
    {
      name: "Overview",
      value: "overview",
      pathname: "/coretime",
      icon: <MenuOverview />,
    },
  ],
};
