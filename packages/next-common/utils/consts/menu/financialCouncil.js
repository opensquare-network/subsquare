import { MenuFinancialCouncil } from "@osn/icons/subsquare";

export const Names = {
  financialCouncil: "FINANCIAL COUNCIL",
  financialMotions: "Motions",
  financialCouncilMembers: "Members",
};

export function getFinancialCouncilMenu(summary) {
  const activeFinancialMotions = summary?.financialMotions?.active || 0;

  return {
    name: Names.financialCouncil,
    activeCount: activeFinancialMotions,
    icon: <MenuFinancialCouncil />,
    pathname: "/financial-council",
    items: [
      {
        value: "financialMotions",
        name: Names.financialMotions,
        activeCount: activeFinancialMotions,
        pathname: "/financial-council/motions",
        extraMatchNavMenuActivePathnames: ["/financial-council/motions/[id]"],
      },
      {
        value: "financialCouncilMembers",
        name: Names.financialCouncilMembers,
        pathname: "/financial-council/members",
      },
    ],
  };
}

const financialCouncil = getFinancialCouncilMenu();

export default financialCouncil;
