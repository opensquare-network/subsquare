import { DropdownFilter } from "next-common/components/dropdownFilter";
import Tooltip from "next-common/components/tooltip";
import Toggle from "next-common/components/toggle";
import { useRankFilterInDropdown } from "next-common/hooks/fellowship/useRankFilter";
import {
  useCommittedFilterState,
  useStagedFilterState,
} from "next-common/components/dropdownFilter/context";
import { useMemo } from "react";
import { isNil } from "lodash-es";

export default function useEvidenceFilter(evidences = []) {
  const ranks = [...new Set(evidences.map((m) => m.rank))].filter(Boolean);
  const { rank, component: rankFilterComponent } =
    useRankFilterInDropdown(ranks);
  const { isOn: isActiveOnly, component: activeOnlySwitch } =
    useEvidenceOnlyActiveSwitchInDropdown();

  const filteredEvidences = useMemo(() => {
    let filtered = evidences;

    if (rank) {
      filtered = filtered.filter((evidence) => {
        return evidence.rank === rank;
      });
    }

    if (isActiveOnly) {
      filtered = filtered.filter((evidence) => isNil(evidence.activeEvidence));
    }

    return filtered;
  }, [evidences, isActiveOnly, rank]);

  const component = (
    <DropdownFilter className="w-[320px]">
      {/* {coreOnlySwitch} */}
      {activeOnlySwitch}
      {rankFilterComponent}
    </DropdownFilter>
  );

  return {
    filteredEvidences,
    component,
  };
}

function useEvidenceOnlyActiveSwitchInDropdown() {
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
    <div className="flex items-center justify-between gap-[8px] my-4">
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
