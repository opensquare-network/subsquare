import { useVotesLoading } from "next-common/hooks/useVotesLoading";
import CommentsFilterFormFilter from "./filter";
import CommentsFilterFormSorter from "./sorter";
import Loading from "next-common/components/loading";
import { useDetailType } from "next-common/context/page";
import { detailPageCategory } from "next-common/utils/consts/business/category";

export default function CommentsFilterForm() {
  const loading = useVotesLoading();
  const detailType = useDetailType();

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
