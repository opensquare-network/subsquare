import businessCategory from "../../business/category";
// fixme: we should not import dependencies from next page
import { toFellowshipReferendaListItem, toGov2ReferendaListItem } from "@subsquare/next/utils/viewfuncs";

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
      formatter: (chain, item) => toGov2ReferendaListItem(item),
    },
    {
      id: "fellowship",
      name: "Fellowship",
      categoryName: "Fellowship",
      categoryId: businessCategory.fellowship,
      routePath: "fellowship",
      apiPath: "fellowship/referendums",
      formatter: (chain, item) => toFellowshipReferendaListItem(item),
    },
  ],
};

export default gov2Category;
