import { useEffect, useState } from "react";
import {
  gov2BackMenu,
  gov2FellowshipMenu,
  gov2ReferendaMenu,
} from "../consts/menu/gov2";
import TrackIconMap from "../../components/icons/track";
import mockTracks from "../mocks/gov2-tracks.json";
import { parseGov2Name } from "../gov2";

export function useGov2Menu() {
  const [referendaMenu, setReferendaMenu] = useState(gov2ReferendaMenu);
  const [fellowshipMenu] = useState(gov2FellowshipMenu);

  // FIXME: track items from server api
  useEffect(() => {
    const { items } = gov2ReferendaMenu;
    const trackItems = mockTracks.map((track) => {
      return {
        value: track.id,
        name: parseGov2Name(track.name),
        pathname: `/gov2/${track.name}`,
        icon: TrackIconMap[track.id] ?? TrackIconMap.Default,
      };
    });

    setReferendaMenu({
      ...gov2ReferendaMenu,
      items: items.concat(trackItems),
    });
  }, []);

  return [gov2BackMenu, referendaMenu, fellowshipMenu];
}
