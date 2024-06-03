import CommentsFilterFormFilter from "./filter";
import CommentsFilterFormSorter from "./sorter";

export default function CommentsFilterForm() {
  return (
    <div className="flex items-center gap-x-2">
      <CommentsFilterFormSorter />
      <CommentsFilterFormFilter />
    </div>
  );
}
