import { DropdownFilter } from "next-common/components/dropdownFilter";
import { useRankFilterInDropdown } from "next-common/hooks/fellowship/useRankFilter";
import useEvidenceOnlyActiveSwitch from "next-common/hooks/fellowship/useEvidenceOnlyActiveSwitch";
import { useMemo } from "react";
import { isNil } from "lodash-es";

export default function useEvidenceFilter(evidences = []) {
  const ranks = [...new Set(evidences.map((m) => m.rank))].filter(Boolean);
  const { rank, component: rankFilterComponent } =
    useRankFilterInDropdown(ranks);
  const { isOn: isActiveOnly, component: activeOnlySwitch } =
    useEvidenceOnlyActiveSwitch();

  const filteredEvidences = useMemo(() => {
    let filtered = evidences;

    if (rank) {
      filtered = filtered.filter((evidence) => {
        return evidence.rank === rank;
      });
    }

    if (isActiveOnly) {
      filtered = filtered.filter((evidence) => !isNil(evidence.activeEvidence));
    }

    return filtered;
  }, [evidences, isActiveOnly, rank]);

  const component = (
    <DropdownFilter className="w-[320px]">
      {activeOnlySwitch}
      {rankFilterComponent}
    </DropdownFilter>
  );

  return {
    filteredEvidences,
    component,
  };
}
