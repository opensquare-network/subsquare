import { isNil } from "lodash-es";

export default function isWin(vote, referenda) {
  if (vote.isSplit || vote.isSplitAbstain) {
    return false;
  }
  const referendum = referenda.find(
    (referendum) => referendum.referendumIndex === vote.referendumIndex,
  );
  if (isNil(referendum)) {
    return false;
  }
  const isApproved = !!referendum.approved;
  return (isApproved && vote.aye) || (!isApproved && !vote.aye);
}
