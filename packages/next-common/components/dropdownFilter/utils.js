import { useMemo } from "react";
import { useCommittedFilterState, useStagedFilterState } from "./context";

function normalizeBooleanValues(keys, filterState) {
  return Object.entries(filterState).reduce((acc, [key, value]) => {
    if (key in keys) {
      acc[key] = value.toString() === "true";
    } else {
      acc[key] = value;
    }
    return acc;
  }, {});
}

function useNormalizeFilterValues({ booleanFilterKeys, filterState }) {
  return useMemo(() => {
    return normalizeBooleanValues(booleanFilterKeys, filterState);
  }, [booleanFilterKeys, filterState]);
}

export function useNormalizedStagedFilterValues({ booleanFilterKeys = [] }) {
  const [filterState, setFilterState] = useStagedFilterState();
  const normalizeFilterState = useNormalizeFilterValues({
    booleanFilterKeys,
    filterState,
  });
  return [normalizeFilterState, setFilterState];
}

export function useNormalizedCommittedFilterValues({ booleanFilterKeys = [] }) {
  const [filterState, setFilterState] = useCommittedFilterState();
  const normalizeFilterState = useNormalizeFilterValues({
    booleanFilterKeys,
    filterState,
  });
  return [normalizeFilterState, setFilterState];
}
