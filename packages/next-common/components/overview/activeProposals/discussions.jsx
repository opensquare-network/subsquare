import { discussionsMenu } from "next-common/utils/consts/menu/common";
import { getProposalPostTitleColumn } from "./columns/common";
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

export function getActiveProposalDiscussions({ activeProposals }) {
  const chainSettings = getChainSettings(CHAIN);
  const subsquare = activeProposals.discussions?.subsquare;
  const polkassembly = activeProposals.discussions?.polkassembly;
  const activeCount = subsquare?.total + polkassembly?.total || 0;

  const items = [
    {
      lazy: false,
      value: "subsquare",
      name: "Subsquare",
      api: {
        path: overviewApi.discussions,
        initData: subsquare,
      },
      activeCount: subsquare?.total,
      formatter: (item) => normalizeDiscussionListItem(CHAIN, item),
      columns: [getProposalPostTitleColumn(), lastActivityColumn],
    },
    chainSettings.hasPolkassemblyDiscussions && {
      lazy: false,
      value: "polkassembly",
      name: "Polkassembly",
      api: {
        path: overviewApi.polkassemblyDiscussions,
        initData: polkassembly,
      },
      activeCount: polkassembly?.total,
      formatter: (item) => normalizePolkassemblyDiscussionListItem(CHAIN, item),
      columns: [getProposalPostTitleColumn(), lastActivityColumn],
    },
  ].filter(Boolean);

  return {
    ...discussionsMenu,
    activeCount,
    items,
  };
}
