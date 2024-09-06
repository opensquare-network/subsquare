import { keys, pick } from "lodash-es";
import { useUrlSearchParams } from "./useUrlSearchParams";
import { createGlobalState } from "react-use";
import { useEffect, useMemo } from "react";

const defaultValue = {
  // sortby
  comments_sort_by: "oldest",
  // filter
  hide_0: false,
  show_voters_only: false,
  show_dv_only: false,
  hide_deleted: true,
};

const useFilterState = createGlobalState(defaultValue);

/**
 * @returns {[state, set, update]}
 */
export function usePostCommentsFilterParams() {
  const [state, setState] = useFilterState();
  const [params, set, update] = useUrlSearchParams({
    removeFalsyValues: true,
    defaultValue,
  });

  /** @type {defaultValue} */
  const value = useMemo(() => {
    return pick(params, keys(defaultValue));
  }, [params]);

  useEffect(() => {
    setState(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return [state, set, update];
}
