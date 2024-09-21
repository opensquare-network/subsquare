import { discussionsMenu } from "next-common/utils/consts/menu/common";
import {
  getLastActivityColumn,
  getProposalPostTitleColumn,
  getStatusTagColumn,
  getVoteSummaryColumnPlaceholder,
} from "./columns";
import normalizeDiscussionListItem from "next-common/utils/viewfuncs/discussion/normalizeDiscussionListItem";
import { CHAIN } from "next-common/utils/constants";
import normalizePolkassemblyDiscussionListItem from "next-common/utils/viewfuncs/discussion/normalizePaListItem";
import { overviewApi } from "next-common/services/url";
import normalizePolkadotForumTopicListItem from "next-common/utils/viewfuncs/discussion/normalizePolkadotForumTopicListItem";
import { discussionsForumTopicsColumns } from "./columns/discussionsForumTopics";
import { discussionsRFCsColumns } from "./columns/discussionsRFCs";
import normalizeRFCsListItem from "next-common/utils/viewfuncs/discussion/normalizeRFCsListItem";
import { usePageProps } from "next-common/context/page";
import { useChainSettings } from "next-common/context/chain";
import { fetchRFCs } from "next-common/services/overview/RFCs";
import { useEffect, useState } from "react";

const discussionsColumns = [
  getProposalPostTitleColumn(),
  getLastActivityColumn(),
  getVoteSummaryColumnPlaceholder(),
  { ...getStatusTagColumn(), name: "" },
];

export function useRecentProposalDiscussions() {
  const { recentSummary, recentProposals, forumLatestTopics } = usePageProps();
  const chainSettings = useChainSettings();
  const rfcsData = useRFCsData();

  const subsquare = recentProposals.discussions?.subsquare;
  const polkassembly = recentProposals.discussions?.polkassembly;

  const activeCount =
    (subsquare?.total || 0) +
    (polkassembly?.total || 0) +
    (forumLatestTopics?.items?.length || 0) +
    (rfcsData?.items?.length || 0);

  const items = [
    chainSettings.integrations?.discussionsRFCs && {
      lazy: false,
      value: "rfcs",
      name: "RFC issues",
      api: {
        initData: rfcsData,
        viewAllLink: chainSettings.integrations.discussionsRFCs.link,
      },
      activeCount: rfcsData?.items?.length || 0,
      formatter: (item) => normalizeRFCsListItem(CHAIN, item),
      columns: discussionsRFCsColumns,
    },
    {
      lazy: false,
      value: "subsquare",
      name: "Subsquare",
      pathname: "/discussions",
      api: {
        path: overviewApi.discussions,
        initData: subsquare,
      },
      activeCount: recentSummary?.discussions?.active,
      formatter: (item) => normalizeDiscussionListItem(CHAIN, item),
      columns: discussionsColumns,
    },
    chainSettings.integrations?.discourseForum && {
      lazy: false,
      value: "forumTopics",
      name: "Forum",
      api: {
        initData: forumLatestTopics,
        viewAllLink: chainSettings.integrations.discourseForum.link,
      },
      activeCount: forumLatestTopics?.items?.length,
      formatter: normalizePolkadotForumTopicListItem,
      columns: discussionsForumTopicsColumns,
    },
    chainSettings.integrations?.polkassembly?.discussions && {
      lazy: false,
      value: "polkassembly",
      name: "Polkassembly",
      pathname: "/polkassembly/discussions",
      api: {
        path: overviewApi.polkassemblyDiscussions,
        initData: polkassembly,
      },
      activeCount: polkassembly?.total,
      formatter: (item) => normalizePolkassemblyDiscussionListItem(CHAIN, item),
      columns: discussionsColumns,
    },
  ].filter(Boolean);

  return {
    ...discussionsMenu,
    activeCount,
    items,
  };
}

function useRFCsData() {
  const { integrations } = useChainSettings();
  const [data, setData] = useState();

  useEffect(() => {
    if (integrations?.discussionsRFCs) {
      fetchRFCs().then(setData);
    }
  }, [integrations?.discussionsRFCs]);

  return data;
}
