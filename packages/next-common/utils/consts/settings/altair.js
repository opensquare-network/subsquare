import Chains from "../chains";
import capitalize from "../../capitalize";
import Logo from "../../../assets/header-logos/altair.svg";
import Avatar from "../../../assets/icons/chain/altair.png";
import MenuGroups from "./menuGroups";

const nodes = [
  {
    name: "Centrifuge",
    url: "wss://fullnode.altair.centrifuge.io",
  },
  {
    name: "OnFinality",
    url: "wss://altair.api.onfinality.io/public-ws",
  },
]

const altair = {
  value: Chains.altair,
  name: capitalize(Chains.altair),
  identity: Chains.altair,
  symbol: "AIR",
  decimals: 18,
  hasElections: true,
  ss58Format: 136,
  snsCoverCid: "bafybeidmyuzahzhhsxk5yeofehqj3y2yhj5wn5n4xqblx3j4kczytvnvs4",
  endpoints: nodes,
  loginButtonPrimary: true,
  headerBackgroundColor: "#000000",
  headerLogo: Logo,
  darkHeaderLogo: Logo,
  avatar: Avatar,
  group: MenuGroups.KusamaAndParachains,
}

export default altair;
