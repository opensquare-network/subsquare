import { omit } from "lodash-es";
import Select from "next-common/components/select";
import Tooltip from "next-common/components/tooltip";
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
    displayValue: "Most votes",
  },
  {
    label: "Most Thumbs Up",
    value: "most_thumbs_up",
  },
].map((option) => {
  let label = <span className="text12Medium">{option.label}</span>;
  if (option.disabled) {
    label = (
      <Tooltip content="Not available" className="text-textDisabled">
        {label}
      </Tooltip>
    );
  }

  return {
    ...option,
    label,
  };
});

const defaultSortBy = "oldest";
export const sortByQueryName = "comments_sort_by";

export default function CommentsSorter() {
  const [filterState, setFilterState] = useStagedCommentFilterParams();
  const sortBy = filterState[sortByQueryName] || defaultSortBy;

  const handleSortByChange = (option) => {
    if (option.disabled) {
      return;
    }
    if (option.value === defaultSortBy) {
      setFilterState(omit(filterState, sortByQueryName));
    } else {
      setFilterState({ ...filterState, [sortByQueryName]: option.value });
    }
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
