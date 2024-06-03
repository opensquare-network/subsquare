import { usePostCommentsFilterParams } from "next-common/hooks/usePostCommentsFilterParams";
import CommentsFilterFormFilter from "./filter";
import CommentsFilterFormSorter from "./sorter";

export default function CommentsFilterForm() {
  const [params, , updateParams] = usePostCommentsFilterParams();

  return (
    <div className="flex items-center gap-x-2">
      <CommentsFilterFormSorter params={params} onChange={updateParams} />
      <CommentsFilterFormFilter params={params} onChange={updateParams} />
    </div>
  );
}
