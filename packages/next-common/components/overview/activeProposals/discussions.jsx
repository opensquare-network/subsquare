import { discussionsMenu } from "next-common/utils/consts/menu/common";
import { getProposalPostTitleColumn } from "./columns/common";
import normalizeDiscussionListItem from "next-common/utils/viewfuncs/discussion/normalizeDiscussionListItem";
import { CHAIN } from "next-common/utils/constants";
import normalizePolkassemblyDiscussionListItem from "next-common/utils/viewfuncs/discussion/normalizePaListItem";
import { timeDurationFromNow } from "next-common/utils";
import getChainSettings from "next-common/utils/consts/settings";

const lastActivityColumn = {
  name: "Last Activity",
  className: "w-40 text-left",
  cellRender(data) {
    return (
      data.time && (
        <span className="text14Medium text-textSecondary">
          {timeDurationFromNow(data.time)}
        </span>
      )
    );
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
        path: "overview/discussions",
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
        path: "polkassembly-discussions",
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
