import businessCategory from "../../business/category";
import Chains from "../../chains";
import normalizeTechCommMotionListItem from "../../../viewfuncs/collective/normalizeTechCommMotionListItem";
import normalizeCouncilMotionListItem from "../../../viewfuncs/collective/normalizeCouncilMotionListItem";

export const collectivesCategory = {
  id: "collectives",
  name: "Collective",
  children: [
    {
      id: "councilMotions",
      name: "Council Motions",
      categoryName: "Council motions",
      categoryId: businessCategory.councilMotions,
      routePath: "council/motions",
      apiPath: "council-motions",
      formatter: normalizeCouncilMotionListItem,
      excludeChains: [Chains.kintsugi, Chains.interlay],
    },
    {
      id: "techCommProposals",
      name: "Tech. Comm. Proposals",
      categoryName: "Tech. Comm. proposals",
      categoryId: businessCategory.tcProposals,
      routePath: "techcomm/proposals",
      apiPath: "techcomm-proposals",
      formatter: normalizeTechCommMotionListItem,
    },
  ],
  excludeChains: [Chains.collectives],
};
