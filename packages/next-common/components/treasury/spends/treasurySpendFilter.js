import Select from "next-common/components/select";
import { DropdownFilter } from "next-common/components/dropdownFilter";
import { useStagedFilterState } from "next-common/components/dropdownFilter/context";

const treasurySpendStatusOptions = [
  { value: "", label: "All" },
  { value: "Approved", label: "Approved" },
  { value: "Paid", label: "Paid" },
  { value: "Processed", label: "Processed" },
  { value: "Voided", label: "Voided" },
];

function TreasurySpendStatusSelect() {
  const [treasurySpendFilter, setTreasurySpendFilter] = useStagedFilterState();
  const status = treasurySpendFilter?.status || "";

  const handleStatusChange = ({ value: status }) => {
    setTreasurySpendFilter({ ...treasurySpendFilter, status });
  };

  return (
    <Select
      small
      className="w-[144px] text12Medium"
      value={status}
      options={treasurySpendStatusOptions}
      onChange={handleStatusChange}
    />
  );
}

export default function TreasurySpendFilter() {
  return (
    <DropdownFilter>
      <div className="flex items-center text12Medium">
        <span className="text-textPrimary my-[12px] w-[144px]">Status</span>
        <TreasurySpendStatusSelect />
      </div>
    </DropdownFilter>
  );
}
