import Select from "next-common/components/select";
import { useCommittedFilterState } from "next-common/components/dropdownFilter/context";

const treasurySpendStatusOptions = [
  { value: "", label: "All" },
  { value: "approved", label: "Approved" },
  { value: "paid", label: "Paid" },
  { value: "expired", label: "Expired" },
  { value: "voided", label: "Voided" },
];

export default function TreasurySpendFilter() {
  const [committedFilter, setCommittedFilter] = useCommittedFilterState();
  const status = committedFilter?.status || "";

  const handleStatusChange = ({ value: status }) => {
    setCommittedFilter({ status });
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
