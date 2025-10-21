import businessCategory from "../../business/category";
import normalizeGov2ReferendaListItem from "../../../gov2/list/normalizeReferendaListItem";
import normalizeFellowshipReferendaListItem from "../../../gov2/list/normalizeFellowshipReferendaListItem";
import Chains from "../../chains";

export const gov2Referenda = {
  id: "referenda",
  name: "Referenda",
  categoryId: businessCategory.openGovReferenda,
  routePath: "referenda",
  apiPath: "gov2/referendums",
  formatter: (chain, item) => normalizeGov2ReferendaListItem(item),
  excludeChains: [Chains.collectives],
};

export const gov2Fellowship = {
  id: "fellowshipReferenda",
  name: "Referenda",
  categoryId: businessCategory.fellowship,
  routePath: "fellowship",
  apiPath: "fellowship/referendums",
  formatter: (chain, item) => normalizeFellowshipReferendaListItem(item),
  getCount: (overview) => overview?.openGov?.fellowship ?? 0,
};

export const openGovCategory = {
  id: "openGov",
  name: "OpenGov",
  children: [gov2Referenda],
  getCount: (overview) => overview?.openGov?.referenda ?? 0,
};

export const fellowshipCategory = {
  id: "fellowship",
  name: "Fellowship",
  children: [gov2Fellowship],
  getCount: (overview) => overview?.openGov?.fellowship ?? 0,
};
