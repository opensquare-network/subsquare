import { useContextApi } from "next-common/context/api";
import Checkbox from "next-common/components/checkbox";
import Tooltip from "next-common/components/tooltip";
import { cn } from "next-common/utils";
import { omit } from "lodash-es";
import { useStagedCommentFilterParams } from "./utils";

export const optionItems = [
  {
    key: "hide_0",
    name: "Hide 0 balance accounts",
    default: false,
  },
  {
    key: "show_voters_only",
    name: "Show voter's comments only",
    default: false,
  },
  {
    key: "show_dv_only",
    name: "Show DV delegates only",
    default: false,
  },
  {
    key: "hide_deleted",
    name: "Hide [Deleted] comments",
    default: true,
  },
];

export default function CommentFilterOptions() {
  const api = useContextApi();

  const disabledOptions = {
    hide_0: !api,
  };

  const [filterState, setFilterState] = useStagedCommentFilterParams();

  const handleCheckboxChange = (item) => {
    if (item.disabled) {
      return;
    }
    if (item.key in filterState && filterState[item.key] !== item.default) {
      setFilterState(omit(filterState, item.key));
    } else {
      setFilterState({
        ...filterState,
        [item.key]: !item.default,
      });
    }
  };

  return optionItems.map((item) => (
    <Tooltip
      key={item.key}
      content={disabledOptions[item.key] && "Not available"}
    >
      <div
        className={cn(
          "flex justify-between text12Medium",
          "cursor-pointer whitespace-nowrap select-none",
          disabledOptions[item.key] && "text-textDisabled cursor-default",
        )}
        onClick={() => handleCheckboxChange(item)}
      >
        <div className="cursor-[inherit]">{item.name}</div>
        <Checkbox
          checked={filterState[item.key] ?? item.default}
          className="w-5 h-5 cursor-[inherit]"
        />
      </div>
    </Tooltip>
  ));
}
