import { DropdownFilter } from "next-common/components/dropdownFilter";
import { useStagedFilterState } from "next-common/components/dropdownFilter/context";
import Select from "next-common/components/select";

export const fellowshipVoteOptions = [
  { value: "all", label: "All types" },
  { value: "aye", label: "Aye" },
  { value: "nay", label: "Nay" },
];

export const democracyVoteOptions = [
  ...fellowshipVoteOptions,
  { value: "split", label: "Split" },
];

export const referendaVoteOptions = [
  ...democracyVoteOptions,
  { value: "abstain", label: "Abstain" },
];

export const defaultVoteType = "all";
export const defaultFilterValues = { type: defaultVoteType };

export function VoteFilter({ options }) {
  const [voteFilter, setVoteFilter] = useStagedFilterState();
  const voteType = voteFilter?.type || defaultVoteType;

  const handleTypeChange = ({ value: type }) => {
    setVoteFilter({ ...voteFilter, type });
  };

  return (
    <DropdownFilter>
      <div className="flex items-center text12Medium">
        <span className="text-textPrimary my-[12px] w-[144px]">Type</span>
        <Select
          small
          className="w-[144px] text12Medium"
          value={voteType}
          options={options}
          onChange={handleTypeChange}
        />
      </div>
    </DropdownFilter>
  );
}
