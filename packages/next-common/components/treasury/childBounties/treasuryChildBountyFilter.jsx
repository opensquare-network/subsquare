import Select from "next-common/components/select";
import { useCommittedFilterState } from "next-common/components/dropdownFilter/context";

const treasuryChildBountyStatusOptions = [
  { value: "", label: "All" },
  { value: "added", label: "Added" },
  { value: "curatorProposed", label: "CuratorProposed" },
  { value: "active", label: "Active" },
  { value: "pendingPayout", label: "PendingPayout" },
  { value: "rejected", label: "Rejected" },
  { value: "canceled", label: "Canceled" },
  { value: "claimed", label: "Claimed" },
];

export default function TreasuryChildBountyStatusSelect() {
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
      options={treasuryChildBountyStatusOptions}
      onChange={handleStatusChange}
    />
  );
}
