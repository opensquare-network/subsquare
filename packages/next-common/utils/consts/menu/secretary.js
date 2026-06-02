import { MenuAuthorities } from "@osn/icons/subsquare";
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

function getSecretarySalaryMenu() {
  const chainSettings = getChainSettings(process.env.NEXT_PUBLIC_CHAIN);
  if (!chainSettings.modules.secretary) {
    return null;
  }

  return {
    value: "secretary-salary",
    name: Names.salary,
    pathname: "/secretary/salary",
    extraMatchNavMenuActivePathnames: [
      "/secretary/salary/feeds",
      "/secretary/salary/claimants",
      "/secretary/salary/cycles/[...params]",
    ],
  };
}

function getSecretaryStatisticsMenu() {
  const chainSettings = getChainSettings(process.env.NEXT_PUBLIC_CHAIN);
  if (!chainSettings.modules.secretary) {
    return null;
  }

  return {
    value: "secretary-statistics",
    name: Names.statistics,
    pathname: "/secretary/statistics",
  };
}

export function getSecretaryMenu() {
  const chainSettings = getChainSettings(process.env.NEXT_PUBLIC_CHAIN);
  if (!chainSettings.modules.secretary) {
    return null;
  }

  return {
    name: Names.secretary,
    icon: <MenuAuthorities />,
    pathname: "/secretary",
    items: [
      getSecretaryMembersMenu(),
      getSecretarySalaryMenu(),
      getSecretaryStatisticsMenu(),
    ].filter(Boolean),
  };
}
