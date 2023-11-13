import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { CHAIN } from "next-common/utils/constants";
import { getTreasuryMenu } from "next-common/utils/consts/menu/treasury";
import getChainSettings from "next-common/utils/consts/settings";

async function fetcher(url) {
  const resp = await nextApi.fetch(url);
  if (resp?.result) {
    return resp.result;
  }
  return {};
}

export async function fetchActiveProposalsProps() {
  const chainSettings = getChainSettings(CHAIN);

  const activeProposalsData = {};

  // discussions
  const hasDiscussions = chainSettings.hasDiscussions !== false;
  if (hasDiscussions) {
    activeProposalsData.discussions = await fetcher("overview/discussions");
  }
  if (chainSettings.hasPolkassemblyDiscussions) {
    // TODO
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
  const treasuryMenu = getTreasuryMenu();
  const hasTreasury = !treasuryMenu.excludeToChains.includes(CHAIN);
  const treasuryMenuItems = treasuryMenu.items.filter(
    (m) => !m.excludeToChains?.includes(CHAIN),
  );
  const firstTreasuryMenuItem = treasuryMenuItems[0];
  if (hasTreasury) {
    activeProposalsData.treasury = {};
    const initDataApiMap = {
      proposals: "overview/treasury-proposals",
      bounties: "overview/bounties",
      "child-bounties": "overview/child-bounties",
      tips: "overview/tips",
    };
    const initDataApi = initDataApiMap[firstTreasuryMenuItem.value];
    if (initDataApi) {
      activeProposalsData.treasury[firstTreasuryMenuItem.value] = await fetcher(
        initDataApi,
      );
    }
  }

  // council
  activeProposalsData.council = {};
  activeProposalsData.council.motions = await fetcher("overview/motions");

  // technical committee
  activeProposalsData.technicalCommittee = {};
  activeProposalsData.technicalCommittee.proposals = await fetcher(
    "overview/tc-motions",
  );

  /* await Promise.all([
    nextApi.fetch("overview/financial-motions"),
    nextApi.fetch("overview/alliance-motions"),
    nextApi.fetch("overview/alliance-announcements"),
    nextApi.fetch("overview/advisory-motions"),
    nextApi.fetch("overview/moon-council"),
    nextApi.fetch("overview/open-tc-motion"),
  ]); */

  return activeProposalsData;
}
