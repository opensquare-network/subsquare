import Select from "next-common/components/select";
import Tooltip from "next-common/components/tooltip";
import { usePostCommentsFilterParams } from "next-common/hooks/usePostCommentsFilterParams";
import { useVotesLoading } from "next-common/hooks/useVotesLoading";

export default function CommentsFilterFormSorter() {
  const [params, , updateParams] = usePostCommentsFilterParams();
  const loading = useVotesLoading();

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
      disabled: loading,
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

  return (
    <div className="flex items-center gap-x-2 text12Medium">
      <div className="text-textSecondary w-max">Sort by</div>

      <Select
        className="w-[150px] !text12Medium !py-1.5 !px-3 !h-7"
        small
        value={params.comments_sort_by}
        onChange={(option) => {
          if (option.disabled) {
            return;
          }

          updateParams({ comments_sort_by: option.value });
        }}
        options={options}
      />
    </div>
  );
}
