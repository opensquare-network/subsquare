import businessCategory from "../../business/category";
import normalizeReferendaListItem from "../../../gov2/list/normalizeReferendaListItem";
import normalizeFellowshipReferendaListItem from "../../../gov2/list/normalizeFellowshipReferendaListItem";

const gov2Category = {
  id: "openGov",
  name: "OpenGov",
  children: [
    {
      id: "referenda",
      name: "Referenda",
      categoryName: "OpenGov referenda",
      categoryId: businessCategory.openGovReferenda,
      routePath: "referenda",
      apiPath: "gov2/referendums",
      formatter: (chain, item) => normalizeReferendaListItem(item),
    },
    {
      id: "fellowship",
      name: "Fellowship",
      categoryName: "Fellowship",
      categoryId: businessCategory.fellowship,
      routePath: "fellowship",
      apiPath: "fellowship/referendums",
      formatter: (chain, item) => normalizeFellowshipReferendaListItem(item),
    },
  ],
};

export default gov2Category;
