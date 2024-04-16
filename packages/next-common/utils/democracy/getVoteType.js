export function getVoteType({ isDelegating, isSplit, isSplitAbstain } = {}) {
  let type = ["Standard"];

  if (isDelegating) {
    type = ["Delegation", "d"];
  } else if (isSplit) {
    type = ["Split", "s"];
  } else if (isSplitAbstain) {
    type = ["SplitAbstain", "sa"];
  }

  return type;
}
