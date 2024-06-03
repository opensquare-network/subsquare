import { entries, isNil } from "lodash-es";
import { useRouter } from "next/router";
import queryString from "query-string";

/**
 * @returns {[typeof router.query, set, update]}
 */
export function useUrlSearchParams({
  removeNullishValues = true,
  removeFalsyValues = false,
} = {}) {
  const router = useRouter();
  const parsed = queryString.parse(router.asPath.split("?")?.[1] || "", {
    parseBooleans: true,
    parseNumbers: true,
  });
  const q = { ...router.query, ...parsed };

  function set(query, { shallow = true } = {}) {
    let result = { ...q, ...query };

    entries(result).forEach(([key, value]) => {
      if (removeNullishValues && isNil(value)) {
        delete result[key];
      }
      if (removeFalsyValues && !value) {
        delete result[key];
      }
    });

    router.push({ query: result }, null, { shallow });
  }

  function update(query, { shallow = true } = {}) {
    set({ ...q, ...query }, { shallow });
  }

  return [q, set, update];
}
