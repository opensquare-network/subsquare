import { MenuAlliance } from "@osn/icons/subsquare";

export const Names = {
  alliance: "ALLIANCE",
  allianceMotions: "Motions",
  allianceMembers: "Members",
  allianceUnscrupulous: "Unscrupulous",
  allianceAnnouncements: "Announcements",
};

export function getAllianceMenu(summary) {
  const activeAllianceMotions = summary?.allianceMotions?.active || 0;
  const activeAllianceAnnouncements =
    summary?.allianceAnnouncements?.active || 0;
  const totalActiveCount = activeAllianceMotions + activeAllianceAnnouncements;

  const motions = {
    value: "allianceMotions",
    name: Names.allianceMotions,
    pathname: "/alliance/motions",
    extraMatchNavMenuActivePathnames: ["/alliance/motions/[id]"],
    activeCount: activeAllianceMotions,
  };

  const members = {
    value: "allianceMembers",
    name: Names.allianceMembers,
    pathname: "/alliance/members",
  };

  const unscrupulous = {
    value: "allianceUnscrupulous",
    name: Names.allianceUnscrupulous,
    pathname: "/alliance/unscrupulous",
    extraMatchNavMenuActivePathnames: [
      "/alliance/unscrupulous",
      "/alliance/unscrupulous/websites",
    ],
  };

  const announcements = {
    value: "allianceAnnouncements",
    name: Names.allianceAnnouncements,
    pathname: "/alliance/announcements",
    extraMatchNavMenuActivePathnames: ["/alliance/announcements/[id]"],
    activeCount: activeAllianceAnnouncements,
  };

  return {
    name: Names.alliance,
    icon: <MenuAlliance />,
    pathname: "/alliance",
    activeCount: totalActiveCount,
    items: [announcements, motions, unscrupulous, members],
  };
}

const alliance = getAllianceMenu();

export default alliance;
