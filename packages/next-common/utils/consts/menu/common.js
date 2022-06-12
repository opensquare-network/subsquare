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

const space = process.env.NEXT_PUBLIC_OFF_CHAIN_SPACE;
if (space) {
  commonMenus.items.push({
    value: "offChainVoting",
    name: "Off-chain",
    pathname: `https://voting.opensquare.io/space/${space}`,
  });
}

export default commonMenus;
