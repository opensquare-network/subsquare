import Chains from "../chains";
import { getExcludeChains } from "../../viewfuncs";

const treasury = {
  name: "TREASURY",
  excludeToChains: [Chains.kabocha, Chains.centrifuge],
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
      excludeToChains: [
        "basilisk",
        Chains.kintsugi,
        Chains.interlay,
        Chains.litmus,
      ],
    },
    {
      value: "child-bounties",
      name: "Child Bounties",
      pathname: "/treasury/child-bounties",
      excludeToChains: getExcludeChains([Chains.polkadot, Chains.kusama]),
    },
    {
      value: "tips",
      name: "Tips",
      pathname: "/treasury/tips",
      excludeToChains: [Chains.kintsugi, Chains.interlay, Chains.litmus],
    },
  ],
};

export default treasury;
