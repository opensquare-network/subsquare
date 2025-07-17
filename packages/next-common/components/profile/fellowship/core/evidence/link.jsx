import { isHash } from "next-common/utils";
import { getCidByEvidence } from "next-common/utils/collective/getCidByEvidence";
import Link from "next/link";

export default function EvidenceLink({
  address,
  children,
  className = "",
  cid,
  blockHeight,
  eventIndex,
  evidence = "",
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

  return (
    <Link
      href={`/fellowship/members/${address}/evidences/${evidenceId}`}
      className={className}
    >
      {children}
    </Link>
  );
}
