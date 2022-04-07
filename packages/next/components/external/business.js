import Link from "next/link";
import MultiKVList from "next-common/components/listInfo/multiKVList";
import { shortMotionId } from "next-common/utils/motion";

export default function Business({ external, chain }) {
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
            href={`/council/motion/${motion.indexer.blockHeight}_${motion.hash}`}
          >{`Council Motion #${shortMotionId(motion)}`}</Link>,
        ],
        ["Hash", motion.hash],
      ]);
    }
  }

  return <MultiKVList title="Business" data={business} />;
}
