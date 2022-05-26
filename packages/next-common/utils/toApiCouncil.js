import {
  TYPE_COUNCIL_MOTION,
  TYPE_FINANCIAL_MOTION,
  TYPE_TECH_COMM_MOTION,
} from "./viewConstants";

export default function toApiCouncil(chain, type) {
  if (type === TYPE_COUNCIL_MOTION) {
    if (["karura", "acala"].includes(chain)) {
      return "generalCouncil";
    } else {
      return "council";
    }
  } else if (type === TYPE_FINANCIAL_MOTION) {
    return "financialCouncil";
  } else if (type === TYPE_TECH_COMM_MOTION) {
    return "technicalCommittee";
  }

  return "council";
}
