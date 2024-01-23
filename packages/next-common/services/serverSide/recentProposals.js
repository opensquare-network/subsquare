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
import { getDemocracyMenu } from "next-common/utils/consts/menu/democracy";

export const recentProposalFetchParams = {
  pageSize: 10,
};

async function fetcher(url) {
  const resp = await nextApi.fetch(url, recentProposalFetchParams);
  if (resp?.result) {
    return resp.result;
  }
  return {};
}

export async function fetchRecentProposalsProps(summary = {}) {
  const chainSettings = getChainSettings(CHAIN);

  const recentProposalsData = {};

  // discussions
  const hasDiscussions = chainSettings.hasDiscussions !== false;
  if (hasDiscussions) {
    recentProposalsData.discussions = {};
    recentProposalsData.discussions.subsquare = await fetcher(
      overviewApi.discussions,
    );
    if (chainSettings.hasPolkassemblyDiscussions) {
      recentProposalsData.discussions.polkassembly = await fetcher(
        overviewApi.polkassemblyDiscussions,
      );
    }
  }

  // referenda
  if (chainSettings.hasReferenda) {
    recentProposalsData.referenda = await fetcher(overviewApi.referenda);
  }

  // fellowship
  if (chainSettings.hasFellowship) {
    recentProposalsData.fellowship = await fetcher(overviewApi.fellowship);
  }

  // democracy
  const democracyMenu = getDemocracyMenu(summary);
  const hasDemocracy =
    chainSettings.hasDemocracy !== false ||
    !democracyMenu.excludeToChains.includes(CHAIN) ||
    !democracyMenu.archivedToChains.includes(CHAIN);
  if (hasDemocracy) {
    const democracyMenuItems = democracyMenu.items
      .filter((m) => !m.excludeToChains?.includes(CHAIN))
      .filter((m) => m.activeCount);
    const firstDemocracyMenuItem = democracyMenuItems[0];
    if (firstDemocracyMenuItem) {
      const initDataApiMap = {
        referenda: overviewApi.democracyReferenda,
        democracyProposals: overviewApi.democracyPublicProposals,
        democracyExternals: overviewApi.democracyExternalProposals,
      };
      const initDataApi = initDataApiMap[firstDemocracyMenuItem.value];
      if (initDataApi) {
        recentProposalsData.democracy = {};
        recentProposalsData.democracy[firstDemocracyMenuItem.value] =
          await fetcher(initDataApi);
      }
    }
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
        recentProposalsData.treasury = {};
        recentProposalsData.treasury[firstTreasuryMenuItem.value] =
          await fetcher(initDataApi);
      }
    }
  }

  // council
  const councilMenu = getCouncilMenu();
  const hasCouncil = !councilMenu.excludeToChains.includes(CHAIN);
  if (hasCouncil) {
    recentProposalsData[councilNames.council] = {};
    recentProposalsData[councilNames.council].motions = await fetcher(
      overviewApi.councilMotions,
    );
  }

  // technical committee
  const hasTechComm = chainSettings.hasTechComm !== false;
  if (hasTechComm) {
    recentProposalsData[tcNames.techComm] = {};
    recentProposalsData[tcNames.techComm].techCommProposals = await fetcher(
      overviewApi.tcMotions,
    );
  }

  // financial council
  const financialCouncilMenu = getFinancialCouncilMenu();
  const hasFinancialCouncil =
    !financialCouncilMenu.excludeToChains.includes(CHAIN);
  if (hasFinancialCouncil) {
    recentProposalsData[financialCouncilNames.financialCouncil] = {};
    recentProposalsData[
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
        recentProposalsData[allianceNames.alliance] = {};
        recentProposalsData[allianceNames.alliance][
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
    recentProposalsData[asAdvisoryCommitteeNames.advisoryCommittee] = {};
    recentProposalsData[
      asAdvisoryCommitteeNames.advisoryCommittee
    ].advisoryMotions = await fetcher(overviewApi.advisoryMotions);
  }

  // moonriver
  if (isMoonChain()) {
    recentProposalsData[treasuryCouncilNames.treasuryCouncil] = {};
    recentProposalsData[treasuryCouncilNames.treasuryCouncil].motions =
      await fetcher(overviewApi.treasuryCouncilMotions);

    recentProposalsData[openTechCommNames.openTechCommittee] = {};
    recentProposalsData[
      openTechCommNames.openTechCommittee
    ].openTechCommitteeProposals = await fetcher(overviewApi.openTCMotions);
  }

  return recentProposalsData;
}
