import { noResultObj } from "../consts";

export default function getDemocracyEndInfo(referendumInfo) {
  if (!referendumInfo || !referendumInfo.finished) {
    return noResultObj;
  }

  return {
    hasResult: true,
    approved: referendumInfo.finished.approved,
    end: referendumInfo.finished.end,
  };
}
