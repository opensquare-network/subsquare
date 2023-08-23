import {
  getMotionId,
  getUniqueMotionId,
  shortMotionId,
} from "next-common/utils/motion";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import Link from "next/link";
import { useChain } from "next-common/context/chain";

export default function MotionNavigationItem({ motion, pageMotionId, type }) {
  const chain = useChain();
  const itemId = getUniqueMotionId(motion, chain);
  const isPageMotion = itemId === pageMotionId;

  const isTechComm = type === detailPageCategory.TECH_COMM_MOTION;
  const isCouncilMotion = type === detailPageCategory.COUNCIL_MOTION;
  if (!isTechComm && !isCouncilMotion) {
    throw new Error(`Invalid motion type: ${type}`);
  }
  const prefix = isTechComm ? "Tech. Comm." : isCouncilMotion ? "Motion" : "";
  const text = `${prefix} #${shortMotionId(motion)}`;

  if (isPageMotion) {
    return text;
  }

  const linkId = getMotionId(motion);
  const link = isTechComm
    ? `/techcomm/proposals/${linkId}`
    : `/council/motions/${linkId}`;
  return (
    <Link href={link} legacyBehavior>
      {text}
    </Link>
  );
}
