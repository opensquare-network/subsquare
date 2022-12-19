import React from "react";
import styled from "styled-components";
import Gov2IconOrigin from "../../../assets/imgs/icons/type-gov2.svg";
import BackIcon from "../../../assets/imgs/icons/back.svg";
import Gov2Button from "../../../components/menu/gov2Button";
import {
  TrackIconMap,
  FellowshipTrackIconMap,
} from "../../../components/icons/track";
import { getExcludeChains } from "../../viewfuncs";
import Chains from "../chains";
import { parseGov2TrackName } from "../../gov2";
import MembersIcon from "../../../assets/imgs/icons/members.svg";
import MenuIconWrapper from "../../../components/icons/menuIconWrapper";

const Splitter = styled.div`
  display: block;
  height: 1px;
  width: 62px;
  background: ${(p) => p.theme.grey200Border};
  margin: 10px 0 10px 18px;
`;

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
      icon: (
        <MenuIconWrapper>
          <BackIcon />
        </MenuIconWrapper>
      ),
    },
  ],
};

const gov2FellowshipMenuName = "FELLOWSHIP";
const gov2ReferendaMenuName = "REFERENDA";

export const gov2MenuFoldablePrefix = "GOV2_";

export const allGov2HomeMenuNames = [
  gov2ReferendaMenuName,
  gov2FellowshipMenuName,
];

function calcActiveCount(tracks = []) {
  return tracks.reduce((count, item) => {
    count += item.activeCount || 0;
    return count;
  }, 0);
}

function resolveReferendaTrackMenu(tracks = []) {
  const totalActiveCount = calcActiveCount(tracks);

  const gov2ReferendaMenu = {
    name: gov2ReferendaMenuName,
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
      name: parseGov2TrackName(track.name),
      pathname: `/referenda/track/${track.id}`,
      activeCount: track.activeCount,
      icon: TrackIconMap[track.id] ?? TrackIconMap.Default,
    };
  };

  for (let idx = 0; idx < tracks.length; idx++) {
    const track = tracks[idx];
    gov2ReferendaMenu.items.push(resolveTrackItem(track));
  }

  return gov2ReferendaMenu;
}

function resolveFellowshipTrackMenu(fellowshipTracks = []) {
  const totalActiveCount = calcActiveCount(fellowshipTracks);

  const gov2FellowshipMenu = {
    name: gov2FellowshipMenuName,
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
        component: <Splitter key="splitter" />,
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
    gov2FellowshipMenu.items.push(resolveFellowshipTrackItem(track));
  }

  return gov2FellowshipMenu;
}

export function resolveGov2TracksMenu(tracks = [], fellowshipTracks = []) {
  const gov2ReferendaMenu = resolveReferendaTrackMenu(tracks);
  const gov2FellowshipMenu = resolveFellowshipTrackMenu(fellowshipTracks);
  return [gov2BackMenu, gov2ReferendaMenu, gov2FellowshipMenu];
}
