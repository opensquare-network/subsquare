import {
  ActiveTag,
  ClosedTag,
  QueueingTag,
  MotionTag,
  PositiveTag,
} from "./styled";
import { CoreTimeTypes } from "next-common/components/coretime/cores/hooks/useAllCoreBrokers";

const tagMap = {
  [CoreTimeTypes.BulkCoretime]: ActiveTag,
  [CoreTimeTypes.Reservation]: QueueingTag,
  [CoreTimeTypes.OnDemand]: PositiveTag,
  [CoreTimeTypes.Lease]: MotionTag,
};

export default function CoretimeCoresTag({ state }) {
  const Tag = tagMap[state] || ClosedTag;
  return <Tag>{state}</Tag>;
}
