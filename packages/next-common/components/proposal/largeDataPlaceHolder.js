import { useChain, useChainSettings } from "../../context/chain";
import { isNil } from "lodash-es";
import ExternalLink from "../externalLink";
import { getVaraExplorerPostLink } from "next-common/utils/varaExplorer";
import { detailPageCategory } from "next-common/utils/consts/business/category";

export default function LargeDataPlaceHolder({
  motionIndex,
  referendumIndex,
  proposalIndex,
}) {
  const chain = useChain();
  const { integrations } = useChainSettings();

  if (integrations?.varaExplorer) {
    const link = getVaraExplorerPostLink(
      chain,
      detailPageCategory.GOV2_REFERENDUM,
      { referendumIndex },
    );
    return link ? (
      <ExternalLink href={link}>
        Large data, please check it on Vara Explorer
      </ExternalLink>
    ) : null;
  }

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
