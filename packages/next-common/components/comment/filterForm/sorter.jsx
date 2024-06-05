import Select from "next-common/components/select";
import { usePostCommentsFilterParams } from "next-common/hooks/usePostCommentsFilterParams";

export default function CommentsFilterFormSorter() {
  const [params, , updateParams] = usePostCommentsFilterParams();

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
  ].map((option) => {
    return {
      label: <span className="text12Medium">{option.label}</span>,
      value: option.value,
    };
  });

  return (
    <div className="flex items-center gap-x-2 text12Medium">
      <div className="text-textSecondary w-max">Sort by</div>

      <Select
        className="w-36 !text12Medium !py-1.5 !px-3 !h-7"
        small
        value={params.comments_sortby}
        onChange={(option) => {
          updateParams({ comments_sortby: option.value });
        }}
        options={options}
      />
    </div>
  );
}
