import {
  ClosedTag,
  MotionTag,
  PositiveTag,
} from "next-common/components/tags/state/styled";
import { RegionStatus } from "./utils";

const tagMap = {
  [RegionStatus.Active]: PositiveTag,
  [RegionStatus.Expired]: ClosedTag,
  [RegionStatus.Upcoming]: MotionTag,
};

export default function RegionStatusTag({ status }) {
  const Tag = tagMap[status] || ClosedTag;

  return <Tag>{status}</Tag>;
}
