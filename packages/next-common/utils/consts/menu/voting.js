import { MenuOffChainVoting } from "@osn/icons/subsquare";
import { votingHost, votingSpace } from "next-common/utils/opensquareVoting";

export const votingMenu = {
  value: "offChainVoting",
  name: "Off-chain Voting",
  pathname: `${votingHost}/space/${votingSpace}`,
  icon: <MenuOffChainVoting />,
};
