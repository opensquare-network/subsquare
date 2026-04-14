import { MenuCouncil } from "@osn/icons/subsquare";
import { collectivesCommonNames } from "next-common/utils/consts/menu/common/collectives";
import getChainSettings from "next-common/utils/consts/settings";

export const Names = {
  secretary: "SECRETARY",
  ...collectivesCommonNames,
};

function getSecretaryMembersMenu() {
  const chainSettings = getChainSettings(process.env.NEXT_PUBLIC_CHAIN);
  if (!chainSettings.modules.secretary) {
    return null;
  }

  return {
    value: "secretary-members",
    name: Names.members,
    pathname: "/secretary/members",
  };
}

export function getSecretaryMenu() {
  const chainSettings = getChainSettings(process.env.NEXT_PUBLIC_CHAIN);
  if (!chainSettings.modules.secretary) {
    return null;
  }

  return {
    name: Names.secretary,
    icon: <MenuCouncil />,
    pathname: "/secretary",
    items: [getSecretaryMembersMenu()].filter(Boolean),
  };
}
