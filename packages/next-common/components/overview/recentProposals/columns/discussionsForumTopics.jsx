import { usePageProps } from "next-common/context/page";
import {
  getLastActivityColumn,
  getReferendumPostTitleColumn,
  getVoteSummaryColumnPlaceholder,
} from ".";
import { find } from "lodash-es";

const topicColumn = {
  ...getReferendumPostTitleColumn(),
  name: "Topic",
};

function Category({ id }) {
  const { forumCategories } = usePageProps();
  const category = find(forumCategories?.items, { id });

  return category && <div className="line-clamp-1">{category.name}</div>;
}
const categoryColumn = {
  name: "Category",
  className: "w-[120px]",
  cellRender(data) {
    return <Category id={data?.category_id} />;
  },
};

export const discussionsForumTopicsColumns = [
  topicColumn,
  getLastActivityColumn(),
  getVoteSummaryColumnPlaceholder(),
  categoryColumn,
];
