import { votingThreshold } from "../../../utils/consts/referendum";
import Chains from "../../../utils/consts/chains";
import { useChain } from "../../../context/chain";
import ExternalLink from "next-common/components/externalLink";

export default function Threshold({ threshold = "" }) {
  const chain = useChain();
  const lowercase = threshold.toLowerCase();
  let link;
  if (Chains.kintsugi === chain) {
    link =
      "https://docs.interlay.io/#/kintsugi/governance?id=super-majority-against-negative-turnout-bias";
  } else if (Chains.interlay === chain) {
    link =
      "https://docs.interlay.io/#/interlay/governance?id=super-majority-against-negative-turnout-bias";
  } else if (votingThreshold.SimpleMajority === lowercase) {
    link =
      "https://wiki.polkadot.network/docs/learn-governance#simple-majority";
  } else if (votingThreshold.SuperMajorityAgainst === lowercase) {
    link =
      "https://wiki.polkadot.network/docs/learn-governance#super-majority-against";
  } else if (votingThreshold.SuperMajorityApprove === lowercase) {
    link =
      "https://wiki.polkadot.network/docs/learn-governance#super-majority-approve";
  }

  return (
    <span className="text14Medium">
      {link ? <ExternalLink href={link}>{threshold}</ExternalLink> : threshold}
    </span>
  );
}
