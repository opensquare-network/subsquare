import { getMotionId, shortMotionId } from "next-common/utils/motion";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import Link from "next/link";

export default function MotionNavigationItem({ motion, pageMotionId, type, chain }) {
  const itemId = getMotionId(motion, chain);
  const isPageMotion = itemId === pageMotionId;

  const isTechComm = type === detailPageCategory.TECH_COMM_MOTION;
  const isCouncilMotion = type === detailPageCategory.COUNCIL_MOTION;
  if (!isTechComm && !isCouncilMotion) {
    throw new Error(`Invalid motion type: ${ type }`);
  }
  const prefix = isTechComm ? "Tech. Comm." : isCouncilMotion ? "Motion" : "";
  const text = `${ prefix } #${ shortMotionId(motion) }`;

  if (isPageMotion) {
    return text;
  }

  const link = isTechComm ? `/techcomm/proposal/${ itemId }` : `/council/motion/${ itemId }`;
  return <Link href={ link }>{ text }</Link>
}
