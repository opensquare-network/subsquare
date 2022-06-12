import Chains from "../chains";

const council = {
  name: "COUNCIL",
  excludeToChains: [Chains.kabocha, Chains.kintsugi, Chains.interlay],
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
};

export default council;
