import { omit } from "lodash-es";
import {
  DropdownFilter,
  FilterContentWrapper,
  useStagedFilterState,
} from "next-common/components/dropdownFilter";
import Select from "next-common/components/select";

export function VoteFilter() {
  const [voteFilter, setVoteFilter] = useStagedFilterState();
  const voteType = voteFilter?.type || "all";

  const handleTypeChange = ({ value: type }) => {
    if (type === "all") {
      setVoteFilter(omit(voteFilter, ["type"]));
    } else {
      setVoteFilter({ ...voteFilter, type });
    }
  };

  return (
    <DropdownFilter>
      <FilterContentWrapper>
        <div className="flex items-center text12Medium">
          <span className="text-textPrimary my-[12px] w-[144px]">Type</span>
          <Select
            small
            className="w-[144px] text12Medium"
            value={voteType}
            options={[
              { value: "all", label: "All types" },
              { value: "aye", label: "Aye" },
              { value: "nay", label: "Nay" },
              { value: "split", label: "Split" },
              { value: "abstain", label: "Abstain" },
            ]}
            onChange={handleTypeChange}
          />
        </div>
      </FilterContentWrapper>
    </DropdownFilter>
  );
}
