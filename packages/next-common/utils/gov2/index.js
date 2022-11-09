import capitalize from "../capitalize";
import {
  gov2BackMenu,
  gov2FellowshipMenu,
  gov2ReferendaMenu as gov2ReferendaMenuOrigin,
} from "../consts/menu/gov2";
import TrackIconMap from "../../components/icons/track";

export const parseGov2TrackName = (name = "") =>
  name.split("_").map(capitalize).join(" ");

export function composeGov2TracksMenu(tracks = []) {
  // simply do a copy
  const gov2ReferendaMenu = Object.assign({}, gov2ReferendaMenuOrigin);

  const trackItems = tracks.map((track) => {
    return {
      value: track.id,
      name: parseGov2TrackName(track.name),
      pathname: `/gov2/${track.name}`,
      icon: TrackIconMap[track.id] ?? TrackIconMap.Default,
    };
  });

  gov2ReferendaMenu.items = gov2ReferendaMenu.items.concat(trackItems);

  return [gov2BackMenu, gov2ReferendaMenu, gov2FellowshipMenu];
}
