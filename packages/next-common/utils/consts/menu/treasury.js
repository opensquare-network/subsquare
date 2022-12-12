import Chains from "../chains";
import { getExcludeChains } from "../../viewfuncs";
import ProposalIcon from "../../../assets/imgs/icons/proposals.svg";
import React from "react";
import BountyIcon from "../../../assets/imgs/icons/bounties.svg";
import TipIcon from "../../../assets/imgs/icons/tips.svg";
import MenuIconWrapper from "../../../components/icons/menuIconWrapper";

const treasury = {
  name: "TREASURY",
  excludeToChains: [Chains.kabocha],
  items: [
    {
      value: "proposals",
      name: "Proposals",
      pathname: "/treasury/proposals",
      icon: (
        <MenuIconWrapper>
          <ProposalIcon />
        </MenuIconWrapper>
      ),
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
      icon: (
        <MenuIconWrapper>
          <BountyIcon />
        </MenuIconWrapper>
      ),
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
      icon: (
        <MenuIconWrapper>
          <BountyIcon />
        </MenuIconWrapper>
      ),
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
      icon: (
        <MenuIconWrapper>
          <TipIcon />
        </MenuIconWrapper>
      ),
    },
  ],
};

export default treasury;
