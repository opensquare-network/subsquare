import CommentsFilterFormFilter from "./filter";
import CommentsFilterFormSorter from "./sorter";
import Loading from "next-common/components/loading";
import { useDetailType } from "next-common/context/page";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import usePostCommentsFilterLoading from "next-common/hooks/usePostCommentsFilterLoading";

export default function CommentsFilterForm() {
  const detailType = useDetailType();
  const loading = usePostCommentsFilterLoading();

  if (
    detailType === detailPageCategory.GOV2_REFERENDUM ||
    detailType === detailPageCategory.DEMOCRACY_REFERENDUM
  ) {
    return (
      <div className="flex items-center gap-x-2">
        {loading && <Loading size={16} />}

        <CommentsFilterFormSorter />
        <CommentsFilterFormFilter />
      </div>
    );
  }

  return null;
}
