import { MenuCouncil } from "@osn/icons/subsquare";

export const Names = {
  council: "COUNCIL",
  motions: "Motions",
  councilMembers: "Members",
};

export function getCouncilMenu(summary) {
  const activeMotions = summary?.motions?.active || 0;

  return {
    name: Names.council,
    activeCount: activeMotions,
    icon: <MenuCouncil />,
    pathname: "/council",
    items: [
      {
        value: "motions",
        name: Names.motions,
        pathname: "/council/motions",
        extraMatchNavMenuActivePathnames: ["/council/motions/[id]"],
        activeCount: activeMotions,
      },
      {
        value: "councilMembers",
        name: Names.councilMembers,
        pathname: "/council/members",
      },
    ],
  };
}

const council = getCouncilMenu();

export default council;
