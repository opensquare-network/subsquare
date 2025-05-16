import { sumBy, capitalize } from "lodash-es";
import { MenuReferenda } from "@osn/icons/subsquare";

export const name = "REFERENDA";

export const Names = {
  referenda: "REFERENDA",
  all: "All",
};

export function getReferendaMenu(tracks = []) {
  const totalActiveCount = sumBy(tracks, (t) => t.activeCount || 0);

  const menu = {
    name: capitalize(Names.referenda),
    activeCount: totalActiveCount,
    icon: <MenuReferenda />,
    pathname: "/referenda",
    items: [],
  };

  return menu;
}
