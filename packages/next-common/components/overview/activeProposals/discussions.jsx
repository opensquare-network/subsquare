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
import getChainSettings from "next-common/utils/consts/settings";
import { overviewApi } from "next-common/services/url";
import normalizePolkadotForumTopicListItem from "next-common/utils/viewfuncs/discussion/normalizePolkadotForumTopicListItem";
import { discussionsForumTopicsColumns } from "./columns/discussionsForumTopics";

const discussionsColumns = [
  getProposalPostTitleColumn(),
  getLastActivityColumn(),
  getVoteSummaryColumnPlaceholder(),
  { ...getStatusTagColumn(), name: "" },
];

export function getActiveProposalDiscussions({
  summary,
  activeProposals,
  forumLatestTopics,
}) {
  const chainSettings = getChainSettings(CHAIN);
  const subsquare = activeProposals.discussions?.subsquare;
  const polkassembly = activeProposals.discussions?.polkassembly;
  const activeCount =
    (subsquare?.total || 0) +
    (polkassembly?.total || 0) +
    (forumLatestTopics?.items?.length || 0);

  const items = [
    {
      lazy: false,
      value: "subsquare",
      name: "Subsquare",
      pathname: "/discussions",
      api: {
        path: overviewApi.discussions,
        initData: subsquare,
      },
      activeCount: summary?.discussions?.active,
      formatter: (item) => normalizeDiscussionListItem(CHAIN, item),
      columns: discussionsColumns,
    },
    chainSettings.hasDiscussionsForumTopics && {
      lazy: false,
      value: "forumTopics",
      name: "Forum",
      api: {
        initData: forumLatestTopics,
        viewAllLink: chainSettings?.discourseForumLink,
      },
      activeCount: forumLatestTopics?.items?.length,
      formatter: normalizePolkadotForumTopicListItem,
      columns: discussionsForumTopicsColumns,
    },
    chainSettings.hasPolkassemblyDiscussions && {
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
