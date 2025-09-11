import businessCategory from "../../business/category";
import Chains from "../../chains";
import normalizeReferendaListItem from "../../../viewfuncs/democracy/normalizeReferendaListItem";
import normalizeExternalListItem from "../../../viewfuncs/democracy/normliazeExternalListItem";
import normalizeProposalListItem from "../../../viewfuncs/democracy/normalizeProposalListItem";

export const democracyCategory = {
  id: "democracy",
  name: "Democracy",
  children: [
    {
      id: "referendums",
      name: "Referenda",
      categoryName: "Proposed democracy referenda",
      categoryId: businessCategory.democracyReferenda,
      routePath: "democracy/referenda",
      apiPath: "referendums",
      formatter: normalizeReferendaListItem,
    },
    {
      id: "externals",
      name: "Externals",
      categoryName: "Proposed democracy externals",
      categoryId: businessCategory.democracyExternals,
      routePath: "democracy/externals",
      apiPath: "external-proposals",
      formatter: normalizeExternalListItem,
      excludeChains: [Chains.kintsugi, Chains.interlay],
    },
    {
      id: "proposals",
      name: "Proposals",
      categoryName: "Proposed democracy proposals",
      categoryId: businessCategory.democracyProposals,
      routePath: "democracy/proposals",
      apiPath: "public-proposals",
      formatter: normalizeProposalListItem,
    },
  ],
  excludeChains: [Chains.collectives],
};
