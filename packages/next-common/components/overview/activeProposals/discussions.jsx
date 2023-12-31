import { discussionsMenu } from "next-common/utils/consts/menu/common";
import {
  getProposalPostTitleColumn,
  getStatusTagColumn,
  getVoteSummaryColumn,
} from "./columns";
import normalizeDiscussionListItem from "next-common/utils/viewfuncs/discussion/normalizeDiscussionListItem";
import { CHAIN } from "next-common/utils/constants";
import normalizePolkassemblyDiscussionListItem from "next-common/utils/viewfuncs/discussion/normalizePaListItem";
import { timeDurationFromNow } from "next-common/utils";
import getChainSettings from "next-common/utils/consts/settings";
import { overviewApi } from "next-common/services/url";
import { useEffect, useState } from "react";

function Time({ time }) {
  const [text, setText] = useState("");
  useEffect(() => setText(time), []);
  if (!text) {
    return null;
  }

  return (
    <span className="text14Medium text-textSecondary">
      {timeDurationFromNow(text)}
    </span>
  );
}

const lastActivityColumn = {
  name: "Last Activity",
  className: "w-40 text-left",
  cellRender(data) {
    return data.time && <Time time={data.time} />;
  },
};

export function getActiveProposalDiscussions({ summary, activeProposals }) {
  const chainSettings = getChainSettings(CHAIN);
  const subsquare = activeProposals.discussions?.subsquare;
  const polkassembly = activeProposals.discussions?.polkassembly;
  const activeCount = (subsquare?.total || 0) + (polkassembly?.total || 0);

  const columns = [
    getProposalPostTitleColumn(),
    lastActivityColumn,
    getVoteSummaryColumn(),
    { ...getStatusTagColumn(), name: "" },
  ];

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
      columns,
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
      columns,
    },
  ].filter(Boolean);

  return {
    ...discussionsMenu,
    activeCount,
    items,
  };
}
