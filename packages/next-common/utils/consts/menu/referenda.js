import { getExcludeChains } from "../../viewfuncs";
import Chains from "../chains";
import sumBy from "lodash.sumby";
import startCase from "lodash.startcase";
import { MenuReferenda } from "@osn/icons/subsquare";

export const name = "REFERENDA";

export function getReferendaMenu(tracks = []) {
  const totalActiveCount = sumBy(tracks, (t) => t.activeCount || 0);

  const menu = {
    name,
    excludeToChains: getExcludeChains([
      Chains.development,
      Chains.kusama,
      Chains.moonriver,
      Chains.moonbeam,
      Chains.polkadot,
      Chains.bifrost,
    ]),
    activeCount: totalActiveCount,
    icon: <MenuReferenda />,
    pathname: "/referenda",
    items: [
      {
        value: "all",
        name: "All",
        pathname: "/referenda",
        activeCount: totalActiveCount,
        extraMatchNavMenuActivePathnames: ["/referenda/statistics"],
      },
    ],
  };

  const resolveTrackItem = (track) => {
    return {
      value: track.id,
      name: startCase(track.name),
      pathname: `/referenda/track/${track.id}`,
      activeCount: track.activeCount,
      icon: `[${track.id}]`,
      extraMatchNavMenuActivePathnames: [
        `/referenda/track/${track.id}/statistics`,
      ],
    };
  };

  for (let idx = 0; idx < tracks.length; idx++) {
    const track = tracks[idx];
    menu.items.push(resolveTrackItem(track));
  }

  return menu;
}
