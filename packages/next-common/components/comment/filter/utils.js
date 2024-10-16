import {
  useCommittedFilterState,
  useStagedFilterState,
} from "next-common/components/dropdownFilter";
import { optionItems } from "./options";
import { useMemo } from "react";

function useNormalizeFilterState(filterState) {
  return useMemo(() => {
    const newState = { ...filterState };
    optionItems.forEach((item) => {
      if (item.key in newState) {
        newState[item.key] = newState[item.key].toString() === "true";
      }
    });
    return newState;
  }, [filterState]);
}

export function useStagedCommentFilterParams() {
  const [filterState, setFilterState] = useStagedFilterState();
  const normalizeFilterState = useNormalizeFilterState(filterState);
  return [normalizeFilterState, setFilterState];
}

export function useCommittedCommentFilterParams() {
  const [filterState, setFilterState] = useCommittedFilterState();
  const normalizeFilterState = useNormalizeFilterState(filterState);
  return [normalizeFilterState, setFilterState];
}
