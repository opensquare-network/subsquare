import Loading from "next-common/components/loading";
import { useDetailType } from "next-common/context/page";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import usePostCommentsFilterReady from "next-common/hooks/usePostCommentsFilterReady";
import { DropdownFilter } from "next-common/components/dropdownFilter";
import CommentsSorter, { defaultSortBy, sortByQueryName } from "./sorter";
import {
  optionItems,
  DiscussionCommentFilterOptions,
  ReferendaCommentFilterOptions,
} from "./options";

export const emptyFilterValues = {
  [sortByQueryName]: defaultSortBy,
  ...Object.fromEntries(optionItems.map((item) => [item.key, false])),
};

export const defaultFilterValues = {
  ...emptyFilterValues,
  hide_deleted: true,
  hide_spam: true,
};

export const discussionEmptyFilterValues = {
  hide_deleted: false,
  hide_spam: false,
};

export const discussionDefaultFilterValues = {
  hide_deleted: true,
  hide_spam: true,
};

function ReferendaCommentsFilter() {
  const ready = usePostCommentsFilterReady();

  return (
    <div className="flex items-center gap-x-2">
      {!ready && <Loading size={16} />}

      <DropdownFilter>
        <CommentsSorter />
        <div className="flex flex-col py-[10px] gap-[4px]">
          <ReferendaCommentFilterOptions />
        </div>
      </DropdownFilter>
    </div>
  );
}

export function DiscussionCommentsFilter() {
  return (
    <div className="flex items-center gap-x-2">
      <DropdownFilter>
        <div className="flex flex-col py-[10px] gap-[4px] w-[200px]">
          <DiscussionCommentFilterOptions />
        </div>
      </DropdownFilter>
    </div>
  );
}

export default function CommentsFilter() {
  const detailType = useDetailType();

  if (
    detailType === detailPageCategory.GOV2_REFERENDUM ||
    detailType === detailPageCategory.DEMOCRACY_REFERENDUM
  ) {
    return <ReferendaCommentsFilter />;
  }

  return <DiscussionCommentsFilter />;
}
