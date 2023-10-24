import { MenuFinancialCouncil } from "@osn/icons/subsquare";

export const Names = {
  treasuryCouncil: "TREASURY COUNCIL",
  motions: "Motions",
  councilMembers: "Members",
};

const treasuryCouncil = {
  name: Names.treasuryCouncil,
  pathname: "/treasury-council",
  icon: <MenuFinancialCouncil />,
  items: [
    {
      value: "motions",
      name: Names.motions,
      pathname: "/treasury-council/motions",
      extraMatchNavMenuActivePathnames: ["/treasury-council/motions/[id]"],
    },
    {
      value: "councilMembers",
      name: Names.councilMembers,
      pathname: "/treasury-council/members",
    },
  ],
};

export default treasuryCouncil;
