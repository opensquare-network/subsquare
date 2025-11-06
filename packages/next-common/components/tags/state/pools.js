import { PositiveTag, ClosedTag, NegativeTag } from "./styled";

const tagMap = {
  Open: PositiveTag,
  Destroying: NegativeTag,
  Blocked: ClosedTag,
};

export default function PoolsTag({ state }) {
  const Tag = tagMap[state] || ClosedTag;
  return <Tag>{state}</Tag>;
}
