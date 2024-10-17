import { useMemo } from "react";
import { useCommittedFilterState, useStagedFilterState } from "./context";

function normalizeBooleanValues(keys, filterState) {
  const newState = { ...filterState };
  keys.forEach((key) => {
    if (key in newState) {
      newState[key] = newState[key].toString() === "true";
    }
  });
  return newState;
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
