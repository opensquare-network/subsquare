import { detailPageCategory } from "./consts/business/category";

export default function toApiCouncil(chain, type) {
  if (type === detailPageCategory.COUNCIL_MOTION) {
    if (["karura", "acala"].includes(chain)) {
      return "generalCouncil";
    } else {
      return "council";
    }
  } else if (type === detailPageCategory.FINANCIAL_MOTION) {
    return "financialCouncil";
  } else if (type === detailPageCategory.TECH_COMM_MOTION) {
    return "technicalCommittee";
  }

  return "council";
}
