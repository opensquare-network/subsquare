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

  const items = [
    {
      value: "subsquare",
      name: "Subsquare",
      api: {
        path: "overview/discussions",
        initData: activeProposals.discussions?.subsquare,
      },
      activeCount: subsquare?.total,
      formatter: (item) => normalizeDiscussionListItem(CHAIN, item),
      columns: [getProposalPostTitleColumn(), lastActivityColumn],
    },
    chainSettings.hasPolkassemblyDiscussions && {
      value: "polkassembly",
      name: "Polkassembly",
      activeCount: subsquare?.total,
      formatter: (item) => normalizePolkassemblyDiscussionListItem(CHAIN, item),
      columns: [getProposalPostTitleColumn()],
    },
  ].filter(Boolean);

  return {
    ...discussionsMenu,
    activeCount: subsquare?.total,
    items,
  };
}
