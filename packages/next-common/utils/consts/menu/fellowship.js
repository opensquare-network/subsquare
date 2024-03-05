import React from "react";
import sumBy from "lodash.sumby";
import Divider from "../../../components/styled/layout/divider";
import startCase from "lodash.startcase";
import { getExcludeChains } from "../../viewfuncs";
import Chains from "../chains";
import { MenuFellowship } from "@osn/icons/subsquare";
import getChainSettings from "../settings";

export const name = "FELLOWSHIP";

export const Names = {
  fellowship: "FELLOWSHIP",
  members: "Members",
  core: "Core",
  salary: "Salary",
  all: "All",
};

function getFellowshipCoreMenu() {
  const chainSettings = getChainSettings(process.env.NEXT_PUBLIC_CHAIN);
  if (!chainSettings.hasFellowshipCore) {
    return null;
  }

  return {
    value: "fellowship-core",
    name: Names.core,
    pathname: "/fellowship/core",
  };
}

function getFellowshipSalaryMenu() {
  const chainSettings = getChainSettings(process.env.NEXT_PUBLIC_CHAIN);
  if (!chainSettings.hasFellowshipCore) {
    return null;
  }

  return {
    value: "fellowship-salary",
    name: Names.salary,
    pathname: "/fellowship/salary",
  };
}

export function getFellowshipMenu(fellowshipTracks = [], currentTrackId) {
  const totalActiveCount = sumBy(fellowshipTracks, (t) => t.activeCount || 0);

  const menu = {
    name: Names.fellowship,
    excludeToChains: getExcludeChains([
      Chains.development,
      Chains.kusama,
      Chains.collectives,
      Chains.moonriver,
      Chains.moonbeam,
      Chains.bifrost,
      Chains.bifrostPolkadot,
      Chains.westendCollectives,
      Chains.vara,
      Chains.rococo,
    ]),
    activeCount: totalActiveCount,
    icon: <MenuFellowship />,
    pathname: "/fellowship",
    items: [
      {
        value: "fellowship-members",
        name: Names.members,
        pathname: "/fellowship/members",
      },
      getFellowshipCoreMenu(),
      getFellowshipSalaryMenu(),
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
        name: Names.all,
        pathname: "/fellowship",
        activeCount: totalActiveCount,
        excludeToSumActives: true,
      },
    ].filter(Boolean),
  };

  const resolveFellowshipTrackItem = (track) => {
    return {
      value: track.id,
      name: startCase(track.name),
      pathname: `/fellowship/tracks/${track.id}`,
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
