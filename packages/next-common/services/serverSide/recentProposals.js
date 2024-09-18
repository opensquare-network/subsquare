import nextApi from "next-common/services/nextApi";
import { CHAIN } from "next-common/utils/constants";
import { Names as asAdvisoryCommitteeNames } from "next-common/utils/consts/menu/advisoryCouncil";
import {
  getAllianceMenu,
  Names as allianceNames,
} from "next-common/utils/consts/menu/alliance";
import { Names as councilNames } from "next-common/utils/consts/menu/council";
import { Names as financialCouncilNames } from "next-common/utils/consts/menu/financialCouncil";
import { Names as tcNames } from "next-common/utils/consts/menu/tc";
import { getTreasuryMenu } from "next-common/utils/consts/menu/treasury";
import getChainSettings from "next-common/utils/consts/settings";
import { overviewApi } from "../url";
import { getDemocracyMenu } from "next-common/utils/consts/menu/democracy";
import { Names as communityCouncilNames } from "next-common/utils/consts/menu/communityCouncil";
import { Names as communityTreasuryNames } from "next-common/utils/consts/menu/communityTreasury";
import { isCollectivesChain, isShibuyaChain } from "next-common/utils/chain";
// import { getFellowshipMenu } from "next-common/utils/consts/menu/fellowship";

export const recentProposalFetchParams = {
  pageSize: 10,
  simple: true,
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
  const { modules } = chainSettings;

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
  const {
    modules: { referenda: hasReferenda, fellowship: hasFellowship },
  } = chainSettings;
  if (hasReferenda) {
    recentProposalsData.referenda = await fetcher(overviewApi.referenda);
  }

  // fellowship
  if (hasFellowship) {
    recentProposalsData.fellowship = await fetcher(overviewApi.fellowship);
  }

  // democracy
  const hasDemocracy = modules?.democracy;
  if (hasDemocracy) {
    const democracyMenu = getDemocracyMenu(summary);
    const democracyMenuItems = democracyMenu.items.filter((m) => m.activeCount);
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
  const hasTreasury = !!modules?.treasury;
  if (hasTreasury) {
    const treasuryMenu = getTreasuryMenu(summary).filter((m) => m.activeCount);
    const treasuryMenuItems = treasuryMenu.items.filter((m) => m.activeCount);
    const firstTreasuryMenuItem = treasuryMenuItems[0];
    if (firstTreasuryMenuItem) {
      const initDataApiMap = {
        proposals: overviewApi.treasuryProposals,
        spends: overviewApi.treasurySpends,
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
  const hasCouncil = modules?.council;
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
  const hasFinancialCouncil = !!modules?.financialCouncil;
  if (hasFinancialCouncil) {
    recentProposalsData[financialCouncilNames.financialCouncil] = {};
    recentProposalsData[
      financialCouncilNames.financialCouncil
    ].financialMotions = await fetcher(overviewApi.financialMotions);
  }

  // alliance
  const hasAlliance = modules?.alliance;
  if (hasAlliance) {
    const allianceMenu = getAllianceMenu(summary).filter((m) => m.activeCount);
    const allianceMenuItems = allianceMenu.items;
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
  const hasAdvisoryCommittee = modules?.advisoryCommittee;
  if (hasAdvisoryCommittee) {
    recentProposalsData[asAdvisoryCommitteeNames.advisoryCommittee] = {};
    recentProposalsData[
      asAdvisoryCommitteeNames.advisoryCommittee
    ].advisoryMotions = await fetcher(overviewApi.advisoryMotions);
  }

  if (isShibuyaChain(CHAIN)) {
    // community council
    const hasCommunityCouncil = modules?.communityCouncil;
    if (hasCommunityCouncil) {
      recentProposalsData[communityCouncilNames.communityCouncil] = {};
      recentProposalsData[
        communityCouncilNames.communityCouncil
      ].communityMotions = await fetcher(overviewApi.communityMotions);
    }

    // community treasury
    const hasCommunityTreasuryProposalMenu = modules?.communityTreasury;
    if (hasCommunityTreasuryProposalMenu) {
      recentProposalsData[communityTreasuryNames.communityTreasury] = {};
      recentProposalsData[communityTreasuryNames.communityTreasury].proposals =
        await fetcher(overviewApi.communityTreasuryProposals);
    }
  }

  if (isCollectivesChain(CHAIN)) {
    const fellowshipTreasurySpends = await fetcher(
      overviewApi.fellowshipTreasurySpends,
    );
    recentProposalsData.fellowshipTreasury = {
      spends: fellowshipTreasurySpends,
    };
  }

  return recentProposalsData;
}
