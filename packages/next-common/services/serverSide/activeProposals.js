import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { CHAIN } from "next-common/utils/constants";
import {
  getAdvisoryCommitteeMenu,
  Names as asAdvisoryCommitteeNames,
} from "next-common/utils/consts/menu/advisoryCouncil";
import {
  getAllianceMenu,
  Names as allianceNames,
} from "next-common/utils/consts/menu/alliance";
import {
  getCouncilMenu,
  Names as councilNames,
} from "next-common/utils/consts/menu/council";
import {
  getFinancialCouncilMenu,
  Names as financialCouncilNames,
} from "next-common/utils/consts/menu/financialCouncil";
import { Names as openTechCommNames } from "next-common/utils/consts/menu/openTechCommittee";
import { Names as tcNames } from "next-common/utils/consts/menu/tc";
import { getTreasuryMenu } from "next-common/utils/consts/menu/treasury";
import { Names as treasuryCouncilNames } from "next-common/utils/consts/menu/treasuryCouncil";
import getChainSettings from "next-common/utils/consts/settings";
import isMoonChain from "next-common/utils/isMoonChain";
import { overviewApi } from "../url";

export const activeProposalFetchParams = {
  pageSize: 10,
};

async function fetcher(url) {
  const resp = await nextApi.fetch(url, activeProposalFetchParams);
  if (resp?.result) {
    return resp.result;
  }
  return {};
}

export async function fetchActiveProposalsProps(summary = {}) {
  const chainSettings = getChainSettings(CHAIN);

  const activeProposalsData = {};

  // discussions
  const hasDiscussions = chainSettings.hasDiscussions !== false;
  activeProposalsData.discussions = {};
  if (hasDiscussions) {
    activeProposalsData.discussions.subsquare = await fetcher(
      overviewApi.discussions,
    );
  }
  if (chainSettings.hasPolkassemblyDiscussions) {
    activeProposalsData.discussions.polkassembly = await fetcher(
      overviewApi.polkassemblyDiscussions,
    );
  }

  // referenda
  if (chainSettings.hasReferenda) {
    activeProposalsData.referenda = await fetcher(overviewApi.referenda);
  }

  // fellowship
  if (chainSettings.hasFellowship) {
    activeProposalsData.fellowship = await fetcher(overviewApi.fellowship);
  }

  // democracy
  if (chainSettings.hasDemocracy !== false) {
    activeProposalsData.democracy = {};
    activeProposalsData.democracy.referenda = await fetcher(
      overviewApi.democracyReferenda,
    );
    activeProposalsData.democracy.publicProposals = await fetcher(
      overviewApi.democracyPublicProposals,
    );
    activeProposalsData.democracy.externalProposals = await fetcher(
      overviewApi.democracyExternalProposals,
    );
  }

  // treasury
  const treasuryMenu = getTreasuryMenu(summary);
  const hasTreasury = !treasuryMenu.excludeToChains.includes(CHAIN);
  if (hasTreasury) {
    const treasuryMenuItems = treasuryMenu.items
      .filter((m) => !m.excludeToChains?.includes(CHAIN))
      .filter((m) => m.activeCount);
    const firstTreasuryMenuItem = treasuryMenuItems[0];
    if (firstTreasuryMenuItem) {
      const initDataApiMap = {
        proposals: overviewApi.treasuryProposals,
        bounties: overviewApi.treasuryBounties,
        "child-bounties": overviewApi.treasuryChildBounties,
        tips: overviewApi.treasuryTips,
      };
      const initDataApi = initDataApiMap[firstTreasuryMenuItem.value];
      if (initDataApi) {
        activeProposalsData.treasury = {};
        activeProposalsData.treasury[firstTreasuryMenuItem.value] =
          await fetcher(initDataApi);
      }
    }
  }

  // council
  const councilMenu = getCouncilMenu();
  const hasCouncil = !councilMenu.excludeToChains.includes(CHAIN);
  if (hasCouncil) {
    activeProposalsData[councilNames.council] = {};
    activeProposalsData[councilNames.council].motions = await fetcher(
      overviewApi.councilMotions,
    );
  }

  // technical committee
  const hasTechComm = chainSettings.hasTechComm !== false;
  if (hasTechComm) {
    activeProposalsData[tcNames.techComm] = {};
    activeProposalsData[tcNames.techComm].techCommProposals = await fetcher(
      overviewApi.tcMotions,
    );
  }

  // financial council
  const financialCouncilMenu = getFinancialCouncilMenu();
  const hasFinancialCouncil =
    !financialCouncilMenu.excludeToChains.includes(CHAIN);
  if (hasFinancialCouncil) {
    activeProposalsData[financialCouncilNames.financialCouncil] = {};
    activeProposalsData[
      financialCouncilNames.financialCouncil
    ].financialMotions = await fetcher(overviewApi.financialMotions);
  }

  // alliance
  const allianceMenu = getAllianceMenu(summary);
  const hasAlliance = !allianceMenu.excludeToChains.includes(CHAIN);
  if (hasAlliance) {
    const allianceMenuItems = allianceMenu.items
      .filter((m) => !m.excludeToChains?.includes(CHAIN))
      .filter((m) => m.activeCount);
    const firstAllianceMenuItem = allianceMenuItems[0];
    if (firstAllianceMenuItem) {
      const initDataApiMap = {
        allianceMotions: overviewApi.allianceMotions,
        allianceAnnouncements: overviewApi.allianceAnnouncements,
      };
      const initDataApi = initDataApiMap[firstAllianceMenuItem.value];
      if (initDataApi) {
        activeProposalsData[allianceNames.alliance] = {};
        activeProposalsData[allianceNames.alliance][
          firstAllianceMenuItem.value
        ] = await fetcher(initDataApi);
      }
    }
  }

  // advisory
  const advisoryCommitteeMenu = getAdvisoryCommitteeMenu();
  const hasAdvisoryCommittee =
    !advisoryCommitteeMenu.excludeToChains.includes(CHAIN);
  if (hasAdvisoryCommittee) {
    activeProposalsData[asAdvisoryCommitteeNames.advisoryCommittee] = {};
    activeProposalsData[
      asAdvisoryCommitteeNames.advisoryCommittee
    ].advisoryMotions = await fetcher(overviewApi.advisoryMotions);
  }

  // moonriver
  if (isMoonChain()) {
    activeProposalsData[treasuryCouncilNames.treasuryCouncil] = {};
    activeProposalsData[treasuryCouncilNames.treasuryCouncil].motions =
      await fetcher(overviewApi.treasuryCouncilMotions);

    activeProposalsData[openTechCommNames.openTechCommittee] = {};
    activeProposalsData[
      openTechCommNames.openTechCommittee
    ].openTechCommitteeProposals = await fetcher(overviewApi.openTCMotions);
  }

  return activeProposalsData;
}
