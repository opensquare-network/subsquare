import businessCategory from "../../business/category";
import normalizeAllianceMotion from "../../../../utils/viewfuncs/alliance/allianceMotion";
import normalizeAllianceAnnouncement from "../../../../utils/viewfuncs/alliance/allianceAnnouncement";

const allianceCategory = {
  id: "alliance",
  name: "Alliance",
  children: [
    {
      id: "motions",
      name: "Motions",
      categoryName: "Alliance motions",
      categoryId: businessCategory.allianceMotions,
      routePath: "alliance/motions",
      apiPath: "alliance/motions",
      formatter: (chain, item) => normalizeAllianceMotion(item),
    },
    {
      id: "announcements",
      name: "Announcements",
      categoryName: "Alliance announcements",
      categoryId: businessCategory.allianceAnnouncements,
      routePath: "alliance/announcements",
      apiPath: "alliance/announcements",
      formatter: (chain, item) => normalizeAllianceAnnouncement(item),
    },
  ],
};

export { allianceCategory };
