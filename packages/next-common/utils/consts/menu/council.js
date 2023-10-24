import Chains from "../chains";
import React from "react";
import { MenuCouncil } from "@osn/icons/subsquare";

export const Names = {
  council: "COUNCIL",
  motions: "Motions",
  councilMembers: "Members",
};

const council = {
  name: Names.council,
  excludeToChains: [
    Chains.kabocha,
    Chains.kintsugi,
    Chains.interlay,
    Chains.development,
    Chains["westend-collectives"],
    Chains.collectives,
    Chains.vara,
  ],
  archivedToChains: [Chains.kusama],
  icon: <MenuCouncil />,
  pathname: "/council",
  items: [
    {
      value: "motions",
      name: Names.motions,
      pathname: "/council/motions",
      extraMatchNavMenuActivePathnames: ["/council/motions/[id]"],
    },
    {
      value: "councilMembers",
      name: Names.councilMembers,
      pathname: "/council/members",
    },
  ],
};

export default council;
