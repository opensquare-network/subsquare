import Chains from "../chains";
import { getExcludeChains } from "../../viewfuncs";
import ProposalIcon from "../../../assets/imgs/icons/proposals.svg";
import React from "react";
import BountyIcon from "../../../assets/imgs/icons/bounties.svg";
import TipIcon from "../../../assets/imgs/icons/tips.svg";

const treasury = {
  name: "TREASURY",
  excludeToChains: [Chains.kabocha],
  items: [
    {
      value: "proposals",
      name: "Proposals",
      pathname: "/treasury/proposals",
      icon: <ProposalIcon />,
    },
    {
      value: "bounties",
      name: "Bounties",
      pathname: "/treasury/bounties",
      excludeToChains: [
        Chains.basilisk,
        Chains.hydradx,
        Chains.hydradx,
        Chains.kintsugi,
        Chains.interlay,
        Chains.litmus,
        Chains.zeitgeist,
        Chains.centrifuge,
        Chains.altair,
      ],
      icon: <BountyIcon />,
    },
    {
      value: "child-bounties",
      name: "Child Bounties",
      pathname: "/treasury/child-bounties",
      excludeToChains: getExcludeChains([
        Chains.polkadot,
        Chains.kusama,
        Chains.rococo,
      ]),
      icon: <BountyIcon />,
    },
    {
      value: "tips",
      name: "Tips",
      pathname: "/treasury/tips",
      excludeToChains: [
        Chains.kintsugi,
        Chains.interlay,
        Chains.litmus,
        Chains.zeitgeist,
        Chains.centrifuge,
        Chains.altair,
      ],
      icon: <TipIcon />,
    },
  ],
};

export default treasury;
