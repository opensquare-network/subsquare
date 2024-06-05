import { keys, pick } from "lodash-es";
import { useUrlSearchParams } from "./useUrlSearchParams";

const defaultValue = {
  // sortby
  comments_sortby: "newest",
  // filter
  hide_0: false,
  show_voters_only: false,
  show_dv_only: false,
  hide_deleted: true,
};

/**
 * @returns {[p, set, update]}
 */
export function usePostCommentsFilterParams() {
  const [params, set, update] = useUrlSearchParams({
    removeFalsyValues: true,
    defaultValue,
  });
  /** @type {defaultValue} */
  const p = pick(params, keys(defaultValue));

  return [p, set, update];
}
