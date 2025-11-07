import Select from "next-common/components/select";
import { DropdownFilter } from "next-common/components/dropdownFilter";
import { useStagedFilterState } from "next-common/components/dropdownFilter/context";

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

function TreasuryChildBountyStatusSelect() {
  const [treasuryChildBountyFilter, setTreasuryChildBountyFilter] =
    useStagedFilterState();
  const status = treasuryChildBountyFilter?.status || "";

  const handleStatusChange = ({ value: status }) => {
    setTreasuryChildBountyFilter({ ...treasuryChildBountyFilter, status });
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

export default function TreasuryChildBountyFilter() {
  return (
    <DropdownFilter>
      <div className="flex items-center text12Medium">
        <span className="text-textPrimary my-[12px] w-[144px]">Status</span>
        <TreasuryChildBountyStatusSelect />
      </div>
    </DropdownFilter>
  );
}
