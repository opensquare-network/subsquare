import Chains from "../chains";
import React from "react";
import { MenuTechComm } from "@osn/icons/subsquare";

const techComm = {
  name: "TECH.COMM.",
  excludeToChains: [
    Chains.kabocha,
    Chains.centrifuge,
    Chains.altair,
    Chains.development,
    Chains["westend-collectives"],
    Chains.collectives,
  ],
  icon: <MenuTechComm />,
  pathname: "/techcomm",
  items: [
    {
      value: "techCommProposals",
      name: "Proposals",
      pathname: "/techcomm/proposals",
    },
    {
      value: "techCommMembers",
      name: "Members",
      pathname: "/techcomm/members",
    },
  ],
};

export default techComm;
