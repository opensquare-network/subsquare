import Chains from "./chains";

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
    excludeToChains: [Chains.kabocha, Chains.polkadex],
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
        excludeToChains: ["kintsugi"],
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
        excludeToChains: ["basilisk", "kintsugi"],
      },
      {
        value: "tips",
        name: "Tips",
        pathname: "/treasury/tips",
        excludeToChains: ["kintsugi"],
      },
    ],
  },
  {
    name: "COUNCIL",
    excludeToChains: ["kabocha", "kintsugi"],
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
    excludeToChains: [
      "khala",
      "kusamu",
      "basilisk",
      "kabocha",
      "bifrost",
      "kintsugi",
      Chains.polkadex,
    ],
  },
];

const space = process.env.NEXT_PUBLIC_OFF_CHAIN_SPACE;
if (space) {
  menus[0].items.push({
    value: "offChainVoting",
    name: "Off-chain Voting",
    pathname: `https://voting.opensquare.io/space/${space}`,
  });
}

export default menus;
