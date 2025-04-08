import Chains from "next-common/utils/consts/chains";

export const CollectivesPromoteFastTracks = {
  1: "PromoteFastTo1Dan",
  2: "PromoteFastTo2Dan",
  3: "PromoteFastTo3Dan",
};

export default function getPromoteFastTrackNameFromRank(chain, rank) {
  switch (chain) {
    case Chains.collectives:
    case Chains.westendCollectives:
      return CollectivesPromoteFastTracks[rank];
    default:
      throw new Error("Unsupported chain");
  }
}
