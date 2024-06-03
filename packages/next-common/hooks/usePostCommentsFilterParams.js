import { pick } from "lodash-es";
import { useUrlSearchParams } from "./useUrlSearchParams";

/**
 * @returns {[p, set, update]}
 */
export function usePostCommentsFilterParams() {
  const [params, set, update] = useUrlSearchParams({ removeFalsyValues: true });

  const p = pick(params, [
    // sortby
    "comments_sortby",
    // filter
    "hide_0",
    "show_voters_only",
    "show_dv_only",
    "hide_deleted",
  ]);

  return [p, set, update];
}
