import businessCategory from "../../business/category";
import normalizeGov2ReferendaListItem from "../../../gov2/list/normalizeReferendaListItem";
import normalizeFellowshipReferendaListItem from "../../../gov2/list/normalizeFellowshipReferendaListItem";
import Chains from "../../chains";

export const gov2Referenda = {
  id: "referenda",
  name: "Referenda",
  categoryName: "OpenGov referenda",
  categoryId: businessCategory.openGovReferenda,
  routePath: "referenda",
  apiPath: "gov2/referendums",
  formatter: (chain, item) => normalizeGov2ReferendaListItem(item),
  excludeChains: [Chains.collectives],
};

export const gov2Fellowship = {
  id: "fellowship",
  name: "Fellowship",
  categoryName: "Fellowship",
  categoryId: businessCategory.fellowship,
  routePath: "fellowship",
  apiPath: "fellowship/referendums",
  formatter: (chain, item) => normalizeFellowshipReferendaListItem(item),
};
