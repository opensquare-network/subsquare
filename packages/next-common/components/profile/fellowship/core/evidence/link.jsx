import Tooltip from "next-common/components/tooltip";
import { cn, isHash } from "next-common/utils";
import { getCidByEvidence } from "next-common/utils/collective/getCidByEvidence";
import Link from "next/link";

export default function EvidenceLink({
  address,
  children,
  className = "",
  tooltipClassName = "",
  cid,
  blockHeight,
  eventIndex,
  evidence = "",
  target = "_blank",
  showTooltip = true,
}) {
  let evidenceId = "";
  if (cid) {
    evidenceId = cid;
  } else if (blockHeight) {
    if (eventIndex) {
      evidenceId = `${blockHeight}-${eventIndex}`;
    } else {
      evidenceId = blockHeight;
    }
  } else if (evidence && isHash(evidence)) {
    evidenceId = getCidByEvidence(evidence);
  }

  if (!evidenceId) {
    return null;
  }

  const content = (
    <Link
      href={`/fellowship/members/${address}/evidences/${evidenceId}`}
      className={cn(className, "truncate block")}
      target={target}
    >
      {children}
    </Link>
  );

  return showTooltip ? (
    <Tooltip content={children} className={cn("w-full", tooltipClassName)}>
      {content}
    </Tooltip>
  ) : (
    content
  );
}
