import React from "react";
import sumBy from "lodash.sumby";
import Divider from "../../../components/styled/layout/divider";
import startCase from "lodash.startcase";
import { getExcludeChains } from "../../viewfuncs";
import Chains from "../chains";
import { MenuFellowship } from "@osn/icons/subsquare";

export const name = "FELLOWSHIP";

export function getFellowshipMenu(fellowshipTracks = [], currentTrackId) {
  const totalActiveCount = sumBy(fellowshipTracks, (t) => t.activeCount || 0);

  const menu = {
    name,
    excludeToChains: getExcludeChains([
      Chains.development,
      Chains.kusama,
      Chains.collectives,
      Chains.moonriver,
      Chains.moonbeam,
      Chains.bifrost,
      Chains["westend-collectives"],
      Chains.vara,
    ]),
    activeCount: totalActiveCount,
    icon: <MenuFellowship />,
    pathname: "/fellowship",
    items: [
      {
        value: "fellowship-members",
        name: "Members",
        pathname: "/fellowship/members",
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
      icon: `[${track.id}]`,
      extraMatchNavMenuActivePathnames: [
        track.id === currentTrackId && "/fellowship/referenda/[id]",
      ].filter(Boolean),
    };
  };

  for (let idx = 0; idx < fellowshipTracks.length; idx++) {
    const track = fellowshipTracks[idx];
    menu.items.push(resolveFellowshipTrackItem(track));
  }

  return menu;
}
