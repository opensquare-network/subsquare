import Chains from "./chains";
import { getExcludeChains } from "../viewfuncs";

const menus = [
  {
    items: [
      {
        value: "overview",
        name: "Overview",
        pathname: "/",
      },
      {
        value: "discussions",
        name: "Discussions",
        pathname: "/discussions",
      },
    ],
  },
  {
    name: "DEMOCRACY",
    excludeToChains: [Chains.kabocha],
    items: [
      {
        value: "referenda",
        name: "Referenda",
        pathname: "/democracy/referendums",
      },
      {
        value: "democracyProposals",
        name: "Proposals",
        pathname: "/democracy/proposals",
      },
      {
        value: "democracyExternals",
        excludeToChains: [Chains.kintsugi, Chains.interlay],
        name: "External",
        pathname: "/democracy/externals",
      },
    ],
  },
  {
    name: "TREASURY",
    excludeToChains: [Chains.kabocha],
    items: [
      {
        value: "proposals",
        name: "Proposals",
        pathname: "/treasury/proposals",
      },
      {
        value: "bounties",
        name: "Bounties",
        pathname: "/treasury/bounties",
        excludeToChains: ["basilisk", Chains.kintsugi, Chains.interlay],
      },
      {
        value: "child-bounties",
        name: "Child Bounties",
        pathname: "/treasury/child-bounties",
        excludeToChains: getExcludeChains([Chains.polkadot,Chains.kusama]),
      },
      {
        value: "tips",
        name: "Tips",
        pathname: "/treasury/tips",
        excludeToChains: [Chains.kintsugi, Chains.interlay],
      },
    ],
  },
  {
    name: "COUNCIL",
    excludeToChains: ["kabocha", Chains.kintsugi, Chains.interlay],
    items: [
      {
        value: "motions",
        name: "Motions",
        pathname: "/council/motions",
      },
      {
        value: "councilMembers",
        name: "Members",
        pathname: "/council/members",
      },
    ],
  },
  {
    name: "TECH.COMM.",
    excludeToChains: ["kabocha"],
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
  },
  {
    name: "FINANCIAL COUNCIL",
    items: [
      {
        value: "financialMotions",
        name: "Motions",
        pathname: "/financial-council/motions",
      },
      {
        value: "financialCouncilMembers",
        name: "Members",
        pathname: "/financial-council/members",
      },
    ],
    excludeToChains: getExcludeChains([Chains.karura, Chains.acala]),
  },
];

const space = process.env.NEXT_PUBLIC_OFF_CHAIN_SPACE;
if (space) {
  menus[0].items.push({
    value: "offChainVoting",
    name: "Off-chain",
    pathname: `https://voting.opensquare.io/space/${space}`,
  });
}

export default menus;
