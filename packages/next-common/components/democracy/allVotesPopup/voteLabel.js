import isNil from "lodash.isnil";

const sizing = ["0.1x", "1x", "2x", "3x", "4x", "5x", "6x"];

export default function VoteLabel({ conviction, isDelegating, isSplit, isSplitAbstain, tab }) {
  if (isNil(conviction)) {
    return null;
  }

  let size = sizing[conviction];
  if (tab === "Abstain") {
    return size;
  } else if (isDelegating) {
    return `${ size }/d`;
  } else if (isSplit) {
    return `${ size }/s`;
  } else if (isSplitAbstain) {
    return `${ size }/sa`;
  }

  return size;
}
