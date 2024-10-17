import { optionItems } from "./options";
import {
  useNormalizedCommittedFilterValues,
  useNormalizedStagedFilterValues,
} from "next-common/components/dropdownFilter/utils";

const booleanFilterKeys = optionItems.map(({ key }) => key);

export function useStagedCommentFilterParams() {
  return useNormalizedStagedFilterValues({ booleanFilterKeys });
}

export function useCommittedCommentFilterParams() {
  return useNormalizedCommittedFilterValues({ booleanFilterKeys });
}
