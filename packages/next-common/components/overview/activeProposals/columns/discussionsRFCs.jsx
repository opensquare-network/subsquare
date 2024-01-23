import { getLastActivityColumn, getVoteSummaryColumnPlaceholder } from ".";
import ListPostTitle from "next-common/components/postList/postTitle";

const issueColumn = {
  name: "Issues",
  cellRender(data) {
    return (
      <ListPostTitle
        className="line-clamp-1 mr-4 text14Medium"
        data={data}
        href={data.detailLink}
        ellipsis
      />
    );
  },
};

const placeholderColumn = {
  className: "w-[120px]",
};

export const discussionsRFCsColumns = [
  issueColumn,
  getLastActivityColumn(),
  getVoteSummaryColumnPlaceholder(),
  placeholderColumn,
];
