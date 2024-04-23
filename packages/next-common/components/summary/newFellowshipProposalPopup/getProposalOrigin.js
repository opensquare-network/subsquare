import Chains from "next-common/utils/consts/chains";

const KusamaFellowshipOrigins = {
  0: "FellowshipInitiates",
  1: "Fellowship1Dan",
  2: "Fellowship2Dan",
  3: "Fellows",
  4: "Fellowship4Dan",
  5: "FellowshipExperts",
  6: "Fellowship6Dan",
  7: "FellowshipMasters",
  8: "Fellowship8Dan",
  9: "Fellowship9Dan",
};

const CollectivesFellowshipOrigins = {
  1: "Members",
  2: "Fellowship2Dan",
  3: "Fellows",
  4: "Architects",
  5: "Fellowship5Dan",
  6: "Fellowship6Dan",
  7: "Masters",
  8: "Fellowship8Dan",
  9: "Fellowship9Dan",

  11: "RetainAt1Dan",
  12: "RetainAt2Dan",
  13: "RetainAt3Dan",
  14: "RetainAt4Dan",
  15: "RetainAt5Dan",
  16: "RetainAt6Dan",

  21: "PromoteTo1Dan",
  22: "PromoteTo2Dan",
  23: "PromoteTo3Dan",
  24: "PromoteTo4Dan",
  25: "PromoteTo5Dan",
  26: "PromoteTo6Dan",
};

function getKusamaProposalOrigin(trackId) {
  return { Origins: KusamaFellowshipOrigins[trackId] };
}

function getCollectivesProposalOrigin(trackId) {
  return { FellowshipOrigins: CollectivesFellowshipOrigins[trackId] };
}

function getRococoProposalOrigin(trackId) {
  return { Origins: KusamaFellowshipOrigins[trackId] };
}

export function getProposalOrigin(trackId) {
  switch (process.env.NEXT_PUBLIC_CHAIN) {
    case Chains.kusama:
      return getKusamaProposalOrigin(trackId);
    case Chains.collectives:
      return getCollectivesProposalOrigin(trackId);
    case Chains.rococo:
      return getRococoProposalOrigin(trackId);
    default:
      throw new Error("Unsupport chain");
  }
}
