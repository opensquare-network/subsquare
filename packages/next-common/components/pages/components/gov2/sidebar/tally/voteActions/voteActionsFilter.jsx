import { DropdownFilter } from "next-common/components/dropdownFilter";
import { useStagedFilterState } from "next-common/components/dropdownFilter/context";
import Select from "next-common/components/select";
import {
  ACTION_TYPE_FILTER_VALUES,
  IMPACT_FILTER_VALUES,
} from "./useVoteActionsFilter";

const actionTypeOptions = [
  { value: ACTION_TYPE_FILTER_VALUES.ALL, label: "All" },
  { value: ACTION_TYPE_FILTER_VALUES.VOTE, label: "New vote" },
  { value: ACTION_TYPE_FILTER_VALUES.CHANGE_VOTE, label: "Change Vote" },
  { value: ACTION_TYPE_FILTER_VALUES.REMOVE_VOTE, label: "Remove Vote" },
  { value: ACTION_TYPE_FILTER_VALUES.DELEGATE, label: "New Delegation" },
  {
    value: ACTION_TYPE_FILTER_VALUES.CHANGE_DELEGATION,
    label: "Change Delegation",
  },
  {
    value: ACTION_TYPE_FILTER_VALUES.REMOVE_DELEGATION,
    label: "Remove Delegation",
  },
];

const impactOptions = [
  { value: IMPACT_FILTER_VALUES.ALL, label: "All" },
  { value: IMPACT_FILTER_VALUES.INCREASE_TALLY, label: "Increase Tally" },
  { value: IMPACT_FILTER_VALUES.DECREASE_TALLY, label: "Decrease Tally" },
  { value: IMPACT_FILTER_VALUES.INCREASE_SUPPORT, label: "Increase Support" },
  { value: IMPACT_FILTER_VALUES.DECREASE_SUPPORT, label: "Decrease Support" },
];

function FilterRow({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-[8px]">
      <span className="text12Medium text-textPrimary whitespace-nowrap my-[12px]">
        {label}
      </span>
      {children}
    </div>
  );
}

export default function VoteActionsFilter() {
  const [filters, setFilters] = useStagedFilterState();

  return (
    <DropdownFilter className="w-[300px]">
      <FilterRow label="Action">
        <Select
          small
          className="w-[160px] text12Medium"
          optionsPadding="right"
          options={actionTypeOptions}
          value={filters.actionType ?? ""}
          onChange={({ value }) =>
            setFilters({ ...filters, actionType: value })
          }
        />
      </FilterRow>
      <FilterRow label="Impact">
        <Select
          small
          className="w-[160px] text12Medium"
          optionsPadding="right"
          options={impactOptions}
          value={filters.impact ?? ""}
          onChange={({ value }) => setFilters({ ...filters, impact: value })}
        />
      </FilterRow>
    </DropdownFilter>
  );
}
