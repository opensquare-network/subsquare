import React from "react";
import sumBy from "lodash.sumby";
import MenuIconWrapper from "../../../components/icons/menuIconWrapper";
import MembersIcon from "../../../assets/imgs/icons/members.svg";
import {
  FellowshipTrackIconMap,
  TrackIconMap,
} from "../../../components/icons/track";
import Divider from "../../../components/styled/layout/divider";
import { parseGov2TrackName } from "../../gov2";

export function resolveFellowshipMenu(fellowshipTracks = []) {
  const totalActiveCount = sumBy(fellowshipTracks, (t) => t.activeCount || 0);

  const menu = {
    name: "FELLOWSHIP",
    activeCount: totalActiveCount,
    items: [
      {
        value: "fellowship-members",
        name: "Members",
        pathname: "/fellowship/members",
        icon: (
          <MenuIconWrapper>
            <MembersIcon />
          </MenuIconWrapper>
        ),
      },
      {
        component: (
          <Divider
            key="divider"
            style={{ width: 62, margin: "10px 0 10px 18px" }}
          />
        ),
      },
      {
        value: "all",
        name: "All",
        pathname: "/fellowship",
        icon: TrackIconMap.All,
        activeCount: totalActiveCount,
      },
    ],
  };

  const resolveFellowshipTrackItem = (track) => {
    return {
      value: track.id,
      name: parseGov2TrackName(track.name),
      pathname: `/fellowship/track/${track.id}`,
      activeCount: track.activeCount,
      icon: FellowshipTrackIconMap[track.id] ?? FellowshipTrackIconMap.Default,
    };
  };

  for (let idx = 0; idx < fellowshipTracks.length; idx++) {
    const track = fellowshipTracks[idx];
    menu.items.push(resolveFellowshipTrackItem(track));
  }

  return menu;
}
