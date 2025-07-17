import Link from "next/link";

export default function EvidenceLink({
  address,
  children,
  className = "",
  cid,
  blockHeight,
  eventIndex,
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
