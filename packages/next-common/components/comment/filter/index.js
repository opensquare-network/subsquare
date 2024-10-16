import Loading from "next-common/components/loading";
import { useDetailType } from "next-common/context/page";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import usePostCommentsFilterReady from "next-common/hooks/usePostCommentsFilterReady";
import { CommonDropdownFilter } from "next-common/components/dropdownFilter";
import CommentsSorter, { defaultSortBy, sortByQueryName } from "./sorter";
import CommentFilterOptions, { optionItems } from "./options";

export const emptyFilterValues = {
  [sortByQueryName]: defaultSortBy,
  ...Object.fromEntries(optionItems.map((item) => [item.key, false])),
};

export const defaultFilterValues = {
  ...emptyFilterValues,
  hide_deleted: true,
};

function CommentFilterImpl() {
  return (
    <CommonDropdownFilter>
      <CommentsSorter />
      <div className="flex flex-col py-[10px] gap-[4px]">
        <CommentFilterOptions />
      </div>
    </CommonDropdownFilter>
  );
}

export default function CommentsFilter() {
  const detailType = useDetailType();
  const ready = usePostCommentsFilterReady();

  if (
    detailType === detailPageCategory.GOV2_REFERENDUM ||
    detailType === detailPageCategory.DEMOCRACY_REFERENDUM
  ) {
    return (
      <div className="flex items-center gap-x-2">
        {!ready && <Loading size={16} />}

        <CommentFilterImpl />
      </div>
    );
  }

  return null;
}
