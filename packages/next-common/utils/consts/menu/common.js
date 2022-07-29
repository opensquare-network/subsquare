import Chains from "../chains";

let polkassemblyMenu = {
  value: "polkassembly",
  name: "Polkassembly",
  pathname: "/polkassembly/discussions",
};

const commonMenus = {
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
};

if ([Chains.polkadot, Chains.kusama].includes(process.env.NEXT_PUBLIC_CHAIN)) {
  commonMenus.items.push(polkassemblyMenu);
}

const space = process.env.NEXT_PUBLIC_OFF_CHAIN_SPACE;
if (space) {
  commonMenus.items.push({
    value: "offChainVoting",
    name: "Off-chain",
    pathname: `https://voting.opensquare.io/space/${space}`,
  });
}

export default commonMenus;
