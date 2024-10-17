import { useMemo } from "react";
import { useCommittedFilterState, useStagedFilterState } from "./context";

function normalizeBooleanValues(keys, filterState) {
  return keys.reduce((acc, key) => {
    if (key in filterState) {
      acc[key] = filterState[key].toString() === "true";
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
