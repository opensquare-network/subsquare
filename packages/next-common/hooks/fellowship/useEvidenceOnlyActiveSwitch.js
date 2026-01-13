import {
  useCommittedFilterState,
  useStagedFilterState,
} from "next-common/components/dropdownFilter/context";
import Tooltip from "next-common/components/tooltip";
import Toggle from "next-common/components/toggle";

export default function useEvidenceOnlyActiveSwitch() {
  const [stagedFilter, setStagedFilter] = useStagedFilterState();
  const [committedFilter] = useCommittedFilterState();

  return {
    isOn: committedFilter?.active_only,
    component: (
      <EvidenceOnlyActiveSwitch
        isOn={stagedFilter?.active_only}
        setIsOn={(isOn) =>
          setStagedFilter({ ...stagedFilter, active_only: isOn })
        }
      />
    ),
  };
}

function EvidenceOnlyActiveSwitch({ isOn, setIsOn }) {
  return (
    <div className="flex items-center justify-between gap-[8px] mb-4">
      <div className="flex items-center gap-[4px]">
        <span className="text-textPrimary text12Medium whitespace-nowrap">
          Active Only
        </span>
        <Tooltip content="Only show active evidences" />
      </div>

      <Toggle size="small" isOn={isOn} onToggle={() => setIsOn(!isOn)} />
    </div>
  );
}
