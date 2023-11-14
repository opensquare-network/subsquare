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

async function fetcher(url) {
  const resp = await nextApi.fetch(url);
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
      "overview/discussions",
    );
  }
  if (chainSettings.hasPolkassemblyDiscussions) {
    // TODO
    // activeProposalsData.discussions.polkassembly = await fetcher("overview/discussions");
  }

  // referenda
  if (chainSettings.hasReferenda) {
    activeProposalsData.referenda = await fetcher("overview/referenda");
  }

  // fellowship
  if (chainSettings.hasFellowship) {
    activeProposalsData.fellowship = await fetcher("overview/fellowship");
  }

  // democracy
  if (chainSettings.hasDemocracy !== false) {
    activeProposalsData.democracy = {};
    activeProposalsData.democracy.referenda = await fetcher(
      "overview/democracy-referenda",
    );
    /* activeProposalsData.democracy.publicProposals = await fetcher(
      "overview/public-proposals",
    );
    activeProposalsData.democracy.externalProposals = await fetcher(
      "overview/externals",
    ); */
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
        proposals: "overview/treasury-proposals",
        bounties: "overview/bounties",
        "child-bounties": "overview/child-bounties",
        tips: "overview/tips",
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
    activeProposalsData[councilNames.council][councilNames.motions] =
      await fetcher(
        isMoonChain() ? "overview/moon-council" : "overview/motions",
      );
  }

  // technical committee
  const hasTechComm = chainSettings.hasTechComm !== false;
  if (hasTechComm) {
    activeProposalsData[tcNames.techComm] = {};
    activeProposalsData[tcNames.techComm].techCommProposals = await fetcher(
      "overview/tc-motions",
    );
  }

  // financial council
  const financialCouncilMenu = getFinancialCouncilMenu();
  const hasFinancialCouncil =
    !financialCouncilMenu.excludeToChains.includes(CHAIN);
  if (hasFinancialCouncil) {
    activeProposalsData[financialCouncilNames.financialCouncil] = {};
    activeProposalsData[financialCouncilNames.financialCouncil][
      financialCouncilNames.financialMotions
    ] = await fetcher("overview/financial-motions");
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
        allianceMotions: "overview/alliance-motions",
        allianceAnnouncements: "overview/alliance-announcements",
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
    ].advisoryMotions = await fetcher("overview/advisory-motions");
  }

  // moonriver
  if (isMoonChain()) {
    activeProposalsData[treasuryCouncilNames.treasuryCouncil] = {};
    activeProposalsData[treasuryCouncilNames.treasuryCouncil] = await fetcher(
      "overview/motions",
    );

    activeProposalsData[openTechCommNames.openTechCommittee] = {};
    activeProposalsData[openTechCommNames.openTechCommittee][
      openTechCommNames.openTechCommitteeProposals
    ] = await fetcher("overview/open-tc-motion");
  }

  return activeProposalsData;
}
