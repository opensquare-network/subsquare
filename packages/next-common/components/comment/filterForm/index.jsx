import CommentsFilterFormFilter from "./filter";
import CommentsFilterFormSorter from "./sorter";
import Loading from "next-common/components/loading";
import { useDetailType } from "next-common/context/page";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import usePostCommentsFilterReady from "next-common/hooks/usePostCommentsFilterReady";

export default function CommentsFilterForm() {
  const detailType = useDetailType();
  const ready = usePostCommentsFilterReady();

  if (
    detailType === detailPageCategory.GOV2_REFERENDUM ||
    detailType === detailPageCategory.DEMOCRACY_REFERENDUM
  ) {
    return (
      <div className="flex items-center gap-x-2">
        {!ready && <Loading size={16} />}

        <CommentsFilterFormSorter />
        <CommentsFilterFormFilter />
      </div>
    );
  }

  return null;
}
