import React from "react";
import sumBy from "lodash.sumby";
import MenuIconWrapper from "../../../components/icons/menuIconWrapper";
import MembersIcon from "../../../assets/imgs/icons/members.svg";
import {
  FellowshipTrackIconMap,
  TrackIconMap,
} from "../../../components/icons/track";
import Divider from "../../../components/styled/layout/divider";
import startCase from "lodash.startcase";
import { getExcludeChains } from "../../viewfuncs";
import Chains from "../chains";
import { MenuFellowship } from "@osn/icons/subsquare";

export const name = "FELLOWSHIP";

export function getFellowshipMenu(fellowshipTracks = []) {
  const totalActiveCount = sumBy(fellowshipTracks, (t) => t.activeCount || 0);

  const menu = {
    name,
    excludeToChains: getExcludeChains([
      Chains.development,
      Chains.kusama,
      Chains.collectives,
    ]),
    activeCount: totalActiveCount,
    icon: <MenuFellowship />,
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
        type: "divider",
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
      name: startCase(track.name),
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
