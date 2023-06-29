import { detailPageCategory } from "./consts/business/category";
import isMoonChain from "./isMoonChain";

export default function toApiCouncil(chain, type) {
  if (type === detailPageCategory.COUNCIL_MOTION) {
    if (["karura", "acala"].includes(chain)) {
      return "generalCouncil";
    } else if (isMoonChain(chain)) {
      return "councilCollective";
    } else {
      return "council";
    }
  } else if (type === detailPageCategory.TREASURY_COUNCIL_MOTION) {
    return "treasuryCouncilCollective";
  } else if (type === detailPageCategory.FINANCIAL_MOTION) {
    return "financialCouncil";
  } else if (type === detailPageCategory.ADVISORY_MOTION) {
    return "advisoryCommittee";
  } else if (type === detailPageCategory.TECH_COMM_MOTION) {
    if (isMoonChain(chain)) {
      return "techCommitteeCollective";
    } else {
      return "technicalCommittee";
    }
  } else if (type === detailPageCategory.OPEN_TECH_COMM_PROPOSAL) {
    return "openTechCommitteeCollective";
  } else if (type === detailPageCategory.ALLIANCE_MOTION) {
    return "allianceMotion";
  }

  return "council";
}
