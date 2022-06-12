import Chains from "../chains";

const democracy = {
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
};

export default democracy;
