import { getExcludeChains } from "../../viewfuncs";
import Chains from "../chains";
import { TrackIconMap } from "../../../components/icons/track";
import sumBy from "lodash.sumby";
import startCase from "lodash.startcase";

export const name = "REFERENDA";

export function getReferendaMenu(tracks = []) {
  const totalActiveCount = sumBy(tracks, (t) => t.activeCount || 0);

  const menu = {
    name,
    excludeToChains: getExcludeChains([Chains.development, Chains.kusama, Chains.polkadot]),
    activeCount: totalActiveCount,
    items: [
      {
        value: "all",
        name: "All",
        pathname: "/referenda",
        icon: TrackIconMap.All,
        activeCount: totalActiveCount,
      },
    ],
  };

  const resolveTrackItem = (track) => {
    return {
      value: track.id,
      name: startCase(track.name),
      pathname: `/referenda/track/${track.id}`,
      activeCount: track.activeCount,
      icon: TrackIconMap[track.id] ?? TrackIconMap.Default,
    };
  };

  for (let idx = 0; idx < tracks.length; idx++) {
    const track = tracks[idx];
    menu.items.push(resolveTrackItem(track));
  }

  return menu;
}
