import { MenuCouncil } from "@osn/icons/subsquare";
import getChainSettings from "../settings";
import { CHAIN } from "next-common/utils/constants";

export const Names = {
  council: "COUNCIL",
  motions: "Motions",
  councilMembers: "Members",
};

export function getCouncilMenu(summary) {
  const { modules } = getChainSettings(CHAIN);
  const archived = modules?.council?.archived;

  const activeMotions = summary?.motions?.active || 0;

  return {
    name: Names.council,
    activeCount: activeMotions,
    archived,
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
