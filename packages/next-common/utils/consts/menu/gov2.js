import React from "react";
import Gov2IconOrigin from "../../../assets/imgs/icons/type-gov2.svg";
import BackIcon from "../../../assets/imgs/icons/back.svg";
import Gov2Button from "../../../components/menu/gov2Button";
import TrackIconMap from "../../../components/icons/track";
import { getExcludeChains } from "../../viewfuncs";
import Chains from "../chains";
import styled from "styled-components";
import { parseGov2TrackName } from "../../gov2";

const Gov2Icon = styled(Gov2IconOrigin)`
  path {
    fill: ${(p) => p.theme.textContrast} !important;
  }
`;

export const gov2EntryMenu = {
  items: [
    {
      value: "gov2",
      name: "Governance V2",
      pathname: "/referenda",
      icon: <Gov2Icon />,
      itemRender: (icon, name) => <Gov2Button icon={icon} name={name} />,
    },
  ],
  excludeToChains: getExcludeChains([Chains.development, Chains.kusama]),
};

const gov2BackMenu = {
  items: [
    {
      value: "gov1",
      name: "Back to Gov1",
      pathname: "/",
      icon: <BackIcon />,
    },
  ],
};

const referendaGroupIds = [0, 10, 15];
const governanceGroupIds = [12, 14, 20, 21];
const treasuryGroupIds = [11, 30, 31, 32, 33, 34];
const fellowShipGroupIds = [1, 13];

export function resolveGov2TracksMenu(tracks = []) {
  const totalActiveCount = tracks.reduce((count, item) => {
    count += item.activeCount || 0;
    return count;
  }, 0);

  const gov2ReferendaMenu = {
    items: [
      {
        value: "all",
        name: "All",
        pathname: "/referenda",
        icon: TrackIconMap.All,
        count: totalActiveCount,
      },
    ],
  };

  const gov2GovernanceMenu = {
    name: "GOVERNANCE",
    items: [],
  };

  const gov2TreasuryMenu = {
    name: "TREASURY",
    items: [],
  };

  const gov2FellowshipMenu = {
    name: "FELLOWSHIP",
    items: [],
  };

  const assert = (ids = [], id) => ids.includes(id);
  const resolveTrackItem = (track) => {
    return {
      value: track.id,
      name: parseGov2TrackName(track.name),
      pathname: `/referenda/${track.name}`,
      count: track.activeCount,
      icon: TrackIconMap[track.id] ?? TrackIconMap.Default,
    };
  };

  for (let idx = 0; idx < tracks.length; idx++) {
    const track = tracks[idx];

    if (assert(referendaGroupIds, track.id)) {
      gov2ReferendaMenu.items.push(resolveTrackItem(track));
    } else if (assert(governanceGroupIds, track.id)) {
      gov2GovernanceMenu.items.push(resolveTrackItem(track));
    } else if (assert(treasuryGroupIds, track.id)) {
      gov2TreasuryMenu.items.push(resolveTrackItem(track));
    } else if (assert(fellowShipGroupIds, track.id)) {
      gov2FellowshipMenu.items.push(resolveTrackItem(track));
    }
  }

  return [
    gov2BackMenu,
    gov2ReferendaMenu,
    gov2GovernanceMenu,
    gov2TreasuryMenu,
    gov2FellowshipMenu,
  ];
}
