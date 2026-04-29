import { DropdownFilter } from "next-common/components/dropdownFilter";
import { useStagedFilterState } from "next-common/components/dropdownFilter/context";
import Select from "next-common/components/select";
import {
  VOTE_TYPE_FILTER_VALUES,
  AFFECTION_FILTER_VALUES,
} from "./useVoteActionsFilter";

const voteTypeOptions = [
  { value: VOTE_TYPE_FILTER_VALUES.ALL, label: "All" },
  { value: VOTE_TYPE_FILTER_VALUES.VOTE, label: "Vote" },
  { value: VOTE_TYPE_FILTER_VALUES.CHANGE_VOTE, label: "Change Vote" },
  { value: VOTE_TYPE_FILTER_VALUES.REMOVE_VOTE, label: "Remove Vote" },
  { value: VOTE_TYPE_FILTER_VALUES.DELEGATE, label: "New Delegate" },
  {
    value: VOTE_TYPE_FILTER_VALUES.CHANGE_DELEGATION,
    label: "Change Delegation",
  },
  {
    value: VOTE_TYPE_FILTER_VALUES.REMOVE_DELEGATION,
    label: "Remove Delegation",
  },
];

const affectionOptions = [
  { value: AFFECTION_FILTER_VALUES.ALL, label: "All" },
  { value: AFFECTION_FILTER_VALUES.INCREASE, label: "Increase" },
  { value: AFFECTION_FILTER_VALUES.REDUCTION, label: "Reduction" },
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
          options={voteTypeOptions}
          value={filters.voteType ?? ""}
          onChange={({ value }) => setFilters({ ...filters, voteType: value })}
        />
      </FilterRow>
      <FilterRow label="Impact">
        <Select
          small
          className="w-[160px] text12Medium"
          optionsPadding="right"
          options={affectionOptions}
          value={filters.affection ?? ""}
          onChange={({ value }) => setFilters({ ...filters, affection: value })}
        />
      </FilterRow>
    </DropdownFilter>
  );
}
