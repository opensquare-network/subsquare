import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";

async function fetcher(url) {
  const resp = await nextApi.fetch(url);
  if (resp?.result) {
    return resp.result;
  }
  return {};
}

export async function fetchActiveProposalsProps() {
  const { hasReferenda, hasFellowship, hasDemocracy } = getChainSettings(CHAIN);
  const activeProposalsData = {};

  // referenda
  if (hasReferenda) {
    activeProposalsData.referenda = await fetcher("overview/referenda");
  }

  // fellowship
  if (hasFellowship) {
    activeProposalsData.fellowship = await fetcher("overview/fellowship");
  }

  // democracy
  if (hasDemocracy !== false) {
    activeProposalsData.democracy = {};
    activeProposalsData.democracy.referenda = await fetcher(
      "overview/democracy-referenda",
    );
    activeProposalsData.democracy.publicProposals = await fetcher(
      "overview/public-proposals",
    );
    activeProposalsData.democracy.externalProposals = await fetcher(
      "overview/externals",
    );
  }

  // treasury
  activeProposalsData.treasury = {};
  activeProposalsData.treasury.proposals = await fetcher(
    "overview/treasury-proposals",
  );
  activeProposalsData.treasury.bounties = await fetcher("overview/bounties");
  activeProposalsData.treasury.childBounties = await fetcher(
    "overview/child-bounties",
  );
  activeProposalsData.treasury.tips = await fetcher("overview/tips");

  // council
  activeProposalsData.council = {};
  activeProposalsData.council.motions = await fetcher("overview/motions");

  // technical committee
  activeProposalsData.technicalCommittee = {};
  activeProposalsData.technicalCommittee.proposals = await fetcher(
    "overview/tc-motions",
  );

  /* await Promise.all([
    // nextApi.fetch("overview/discussions"),
    nextApi.fetch("overview/financial-motions"),
    nextApi.fetch("overview/alliance-motions"),
    nextApi.fetch("overview/alliance-announcements"),
    nextApi.fetch("overview/advisory-motions"),
    nextApi.fetch("overview/moon-council"),
    nextApi.fetch("overview/open-tc-motion"),
  ]); */

  return activeProposalsData;
}
