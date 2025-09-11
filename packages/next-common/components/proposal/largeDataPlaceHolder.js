import { useChain, useChainSettings } from "../../context/chain";
import { isNil } from "lodash-es";
import ExternalLink from "../externalLink";

export default function LargeDataPlaceHolder({
  motionIndex,
  referendumIndex,
  proposalIndex,
}) {
  const chain = useChain();
  const { integrations } = useChainSettings();

  if (!integrations?.subscan) {
    return null;
  }

  const domain = integrations.subscan.domain || chain;
  let subscanLink =
    referendumIndex !== undefined
      ? `https://${domain}.subscan.io/referenda/${referendumIndex}`
      : motionIndex !== undefined
      ? `https://${domain}.subscan.io/council/${motionIndex}`
      : `https://${domain}.subscan.io/democracy_proposal/${proposalIndex}`;

  return (
    !isNil(referendumIndex) && (
      <ExternalLink href={subscanLink}>
        Large data, please check it on subscan
      </ExternalLink>
    )
  );
}
