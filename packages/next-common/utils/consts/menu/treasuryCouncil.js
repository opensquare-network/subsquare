import { MenuFinancialCouncil } from "@osn/icons/subsquare";

export const Names = {
  treasuryCouncil: "TREASURY COUNCIL",
  motions: "Motions",
  councilMembers: "Members",
};

export function getTreasuryCouncilMenu(summary) {
  const activeTreasuryCouncilMotions = summary?.motions?.active || 0;

  return {
    name: Names.treasuryCouncil,
    pathname: "/treasury-council",
    icon: <MenuFinancialCouncil />,
    activeCount: activeTreasuryCouncilMotions,
    items: [
      {
        value: "motions",
        name: Names.motions,
        pathname: "/treasury-council/motions",
        extraMatchNavMenuActivePathnames: ["/treasury-council/motions/[id]"],
        activeCount: activeTreasuryCouncilMotions,
      },
      {
        value: "councilMembers",
        name: Names.councilMembers,
        pathname: "/treasury-council/members",
      },
    ],
  };
}

const treasuryCouncil = getTreasuryCouncilMenu();

export default treasuryCouncil;
