import { noop } from "lodash-es";
import Select from "next-common/components/select";

export default function CommentsFilterFormSorter({ params, onChange = noop }) {
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
          onChange({ comments_sortby: option.value });
        }}
        options={options}
      />
    </div>
  );
}
