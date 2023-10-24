import Chains from "../chains";
import React from "react";
import { MenuTechComm } from "@osn/icons/subsquare";

export const Names = {
  techComm: "Technical Committee",
  techCommProposals: "Proposals",
  techCommMembers: "Members",
};

const techComm = {
  name: Names.techComm,
  excludeToChains: [
    Chains.kabocha,
    Chains.centrifuge,
    Chains.altair,
    Chains.development,
    Chains["westend-collectives"],
    Chains.collectives,
    Chains.vara,
  ],
  archivedToChains: [Chains.kusama],
  icon: <MenuTechComm />,
  pathname: "/techcomm",
  items: [
    {
      value: "techCommProposals",
      name: Names.techCommProposals,
      pathname: "/techcomm/proposals",
      extraMatchNavMenuActivePathnames: ["/techcomm/proposals/[id]"],
    },
    {
      value: "techCommMembers",
      name: Names.techCommMembers,
      pathname: "/techcomm/members",
    },
  ],
};

export default techComm;
