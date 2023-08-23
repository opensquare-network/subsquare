import Chains from "../chains";
import React from "react";
import { MenuTechComm } from "@osn/icons/subsquare";

const techComm = {
  name: "Technical Committee",
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
      name: "Proposals",
      pathname: "/techcomm/proposals",
      extraMatchNavMenuActivePathnames: ["/techcomm/proposals/[id]"],
    },
    {
      value: "techCommMembers",
      name: "Members",
      pathname: "/techcomm/members",
    },
  ],
};

export default techComm;
