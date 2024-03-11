import { isNil } from "lodash-es";
import { hashEllipsis } from "../index";

export default function getMotionBreadcrumbName(id, motion = {}) {
  if (!isNil(motion?.motionIndex)) {
    return motion.motionIndex;
  }

  if (motion?.hash) {
    return hashEllipsis(motion?.hash);
  }

  if (id?.match(/^[0-9]+$/)) {
    return id;
  }

  const hash = id?.split("_").pop();
  return hashEllipsis(hash);
}
