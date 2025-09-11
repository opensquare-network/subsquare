import Chains from "next-common/utils/consts/chains";

export const CollectivesFastPromoteTracks = {
  1: "FastPromoteTo1Dan",
  2: "FastPromoteTo2Dan",
  3: "FastPromoteTo3Dan",
};

export default function getFastPromoteTrackNameFromRank(chain, rank) {
  switch (chain) {
    case Chains.collectives:
    case Chains.westendCollectives:
      return CollectivesFastPromoteTracks[rank];
    default:
      throw new Error("Unsupported chain");
  }
}
