import Link from "next/link";
import MultiKVList from "next-common/components/listInfo/multiKVList";
import { shortMotionId } from "next-common/utils/motion";
import Copyable from "next-common/components/copyable";

export default function Business({ external }) {
  if (!external) {
    return null;
  }

  const business = [];

  if (external.motions?.length > 0) {
    for (const motion of external.motions) {
      business.push([
        [
          "Link to",
          <Link
            key="motion-link"
            href={`/council/motions/${motion.indexer.blockHeight}_${motion.hash}`}
          >{`Council Motion #${shortMotionId(motion)}`}</Link>,
        ],
        ["Hash", <Copyable key="hash">{motion.hash}</Copyable>],
      ]);
    }
  }

  return <MultiKVList title="Business" data={business} />;
}
