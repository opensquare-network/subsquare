import businessCategory from "next-common/utils/consts/business/category";

export function isDemocracyCollective(type) {
  return [
    businessCategory.councilMotions,
    businessCategory.collective,
    businessCategory.tcProposals,
    businessCategory.financialMotions,
    businessCategory.advisoryMotions,
    businessCategory.treasuryCouncilMotions,
    businessCategory.openTechCommitteeProposals,
  ].includes(type);
}

export function isGov2Referendum(type) {
  return [
    businessCategory.openGovReferenda,
    businessCategory.fellowship,
  ].includes(type);
}
