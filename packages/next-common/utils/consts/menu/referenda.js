import { getExcludeChains } from "../../viewfuncs";
import Chains from "../chains";
import sumBy from "lodash.sumby";
import startCase from "lodash.startcase";
import { MenuReferenda } from "@osn/icons/subsquare";

export const name = "REFERENDA";

export const Names = {
  referenda: "REFERENDA",
  all: "All",
};

export function getReferendaMenu(tracks = [], currentTrackId) {
  const totalActiveCount = sumBy(tracks, (t) => t.activeCount || 0);

  const menu = {
    name: Names.referenda,
    excludeToChains: getExcludeChains([
      Chains.development,
      Chains.kusama,
      Chains.moonriver,
      Chains.moonbeam,
      Chains.polkadot,
      Chains.bifrost,
      Chains["bifrost-polkadot"],
      Chains.vara,
      Chains.rococo,
      Chains.darwinia2,
    ]),
    activeCount: totalActiveCount,
    icon: <MenuReferenda />,
    pathname: "/referenda",
    items: [
      {
        value: "all",
        name: Names.all,
        pathname: "/referenda",
        activeCount: totalActiveCount,
        extraMatchNavMenuActivePathnames: ["/referenda/statistics"],
        excludeToSumActives: true,
      },
    ],
  };

  const resolveTrackItem = (track) => {
    return {
      value: track.id,
      name: startCase(track.name),
      pathname: `/referenda/tracks/${track.id}`,
      activeCount: track.activeCount,
      icon: `[${track.id}]`,
      extraMatchNavMenuActivePathnames: [
        `/referenda/tracks/${track.id}/statistics`,
        track.id === currentTrackId && "/referenda/[id]",
      ].filter(Boolean),
    };
  };

  for (let idx = 0; idx < tracks.length; idx++) {
    const track = tracks[idx];
    menu.items.push(resolveTrackItem(track));
  }

  return menu;
}
