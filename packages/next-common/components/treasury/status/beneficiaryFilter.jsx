import Select from "next-common/components/select";
import { useState } from "react";

const beneficiarySortByOptions = [
  { value: "proposed_value", label: "Value at proposed time" },
  { value: "awarded_value", label: "Value at awarded time" },
];

function BeneficiarySortBySelect({ sortBy, setSortBy }) {
  const handleSortByChange = ({ value }) => {
    setSortBy(value);
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

function BeneficiarySortBy({ sortBy, setSortBy }) {
  return (
    <div className="flex items-center text12Medium gap-[8px]">
      <span className="text-textSecondary text12Medium">Sort by</span>
      <BeneficiarySortBySelect sortBy={sortBy} setSortBy={setSortBy} />
    </div>
  );
}

export function useBeneficiarySortBy() {
  const [sortBy, setSortBy] = useState("proposed_value");

  const component = <BeneficiarySortBy sortBy={sortBy} setSortBy={setSortBy} />;

  return { sortBy, setSortBy, component };
}
