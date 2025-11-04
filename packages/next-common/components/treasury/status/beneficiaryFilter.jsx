import Select from "next-common/components/select";
import { DropdownFilter } from "next-common/components/dropdownFilter";
import { useStagedFilterState } from "next-common/components/dropdownFilter/context";

const beneficiarySortByOptions = [
  { value: "proposed_value", label: "Value at proposed time" },
  { value: "awarded_value", label: "Value at awarded time" },
];

function BeneficiarySortBySelect() {
  const [beneficiarySortByFilter, setBeneficiarySortByFilter] =
    useStagedFilterState();
  const sortBy = beneficiarySortByFilter?.sort_by || "proposed_value";

  const handleSortByChange = ({ value: sortBy }) => {
    setBeneficiarySortByFilter({ ...beneficiarySortByFilter, sort_by: sortBy });
  };

  return (
    <Select
      small
      className="w-[180px] text12Medium"
      value={sortBy}
      options={beneficiarySortByOptions}
      onChange={handleSortByChange}
    />
  );
}

export default function BeneficiaryFilter() {
  return (
    <DropdownFilter>
      <div className="flex items-center text12Medium">
        <span className="text-textPrimary my-[12px] w-[144px]">Sort by</span>
        <BeneficiarySortBySelect />
      </div>
    </DropdownFilter>
  );
}
