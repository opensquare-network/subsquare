import { discussionsMenu } from "next-common/utils/consts/menu/common";
import { getProposalPostTitleColumn } from "./columns/common";

// FIXME: overview, need discussions active count from server
export function getActiveProposalDiscussions({ activeProposals }) {
  const items = [
    {
      value: "subsquare",
      name: "Subsquare",
      api: {
        path: "overview/discussions",
        initData: activeProposals.discussions?.subsquare,
      },
      columns: [getProposalPostTitleColumn()],
    },
  ];

  return {
    ...discussionsMenu,
    items,
  };
}
