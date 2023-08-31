import { useChain, useChainSettings } from "../../context/chain";
import isNil from "lodash.isnil";
import ExternalLink from "../externalLink";

export default function LargeDataPlaceHolder({
  motionIndex,
  referendumIndex,
  proposalIndex,
}) {
  const chain = useChain();
  const { hasSubscan, subscanDomain } = useChainSettings();
  const domain = subscanDomain || chain;
  let subscanLink =
    referendumIndex !== undefined
      ? `https://${domain}.subscan.io/referenda/${referendumIndex}`
      : motionIndex !== undefined
      ? `https://${domain}.subscan.io/council/${motionIndex}`
      : `https://${domain}.subscan.io/democracy_proposal/${proposalIndex}`;

  return (
    !isNil(referendumIndex) &&
    hasSubscan && (
      <ExternalLink href={subscanLink}>
        Large data, please check it on subscan
      </ExternalLink>
    )
  );
}
