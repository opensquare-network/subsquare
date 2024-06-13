import { useVotesReady } from "next-common/hooks/useVotesReady";
import CommentsFilterFormFilter from "./filter";
import CommentsFilterFormSorter from "./sorter";
import Loading from "next-common/components/loading";
import { useDetailType } from "next-common/context/page";
import { detailPageCategory } from "next-common/utils/consts/business/category";

export default function CommentsFilterForm() {
  const ready = useVotesReady();
  const detailType = useDetailType();

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
