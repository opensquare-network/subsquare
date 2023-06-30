import { MenuFinancialCouncil } from "@osn/icons/subsquare";

const treasuryCouncil = {
  name: "TREASURY COUNCIL",
  icon: <MenuFinancialCouncil />,
  items: [
    {
      value: "motions",
      name: "Motions",
      pathname: "/treasury-council/motions",
    },
    {
      value: "councilMembers",
      name: "Members",
      pathname: "/treasury-council/members",
    },
  ],
};

export default treasuryCouncil;
