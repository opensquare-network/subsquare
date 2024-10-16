import Select from "next-common/components/select";
import { useStagedCommentFilterParams } from "./utils";

const options = [
  {
    label: "Newest",
    value: "newest",
  },
  {
    label: "Oldest",
    value: "oldest",
  },
  {
    label: "Most votes",
    value: "most_votes",
  },
  {
    label: "Most Thumbs Up",
    value: "most_thumbs_up",
  },
];

export const defaultSortBy = "oldest";
export const sortByQueryName = "comments_sort_by";

export default function CommentsSorter() {
  const [filterState, setFilterState] = useStagedCommentFilterParams();
  const sortBy = filterState[sortByQueryName] || defaultSortBy;

  const handleSortByChange = (option) => {
    if (option.disabled) {
      return;
    }
    setFilterState({ ...filterState, [sortByQueryName]: option.value });
  };

  return (
    <div className="flex items-center text12Medium">
      <span className="text-textPrimary my-[12px] w-[144px]">Sort by</span>
      <Select
        className="w-[144px] text12Medium"
        small
        value={sortBy}
        onChange={handleSortByChange}
        options={options}
      />
    </div>
  );
}
