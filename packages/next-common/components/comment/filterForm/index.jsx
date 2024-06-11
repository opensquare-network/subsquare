import { useVotesLoading } from "next-common/hooks/useVotesLoading";
import CommentsFilterFormFilter from "./filter";
import CommentsFilterFormSorter from "./sorter";
import Loading from "next-common/components/loading";

export default function CommentsFilterForm() {
  const loading = useVotesLoading();

  return (
    <div className="flex items-center gap-x-2">
      {loading && <Loading size={16} />}

      <CommentsFilterFormSorter />
      <CommentsFilterFormFilter />
    </div>
  );
}
