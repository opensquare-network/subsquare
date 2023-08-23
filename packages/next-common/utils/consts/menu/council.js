import Chains from "../chains";
import React from "react";
import { MenuCouncil } from "@osn/icons/subsquare";

const council = {
  name: "COUNCIL",
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
      name: "Motions",
      pathname: "/council/motions",
      extraMatchNavMenuActivePathnames: ["/council/motions/[id]"],
    },
    {
      value: "councilMembers",
      name: "Members",
      pathname: "/council/members",
    },
  ],
};

export default council;
