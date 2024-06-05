import { entries, isNil } from "lodash-es";
import { useRouter } from "next/router";
import queryString from "query-string";
import { useMemo, useState } from "react";

/**
 * @returns {[typeof router.query, set, update]}
 */
export function useUrlSearchParams({
  removeNullishValues = true,
  removeFalsyValues = false,
  defaultValue = {},
} = {}) {
  const router = useRouter();
  const parsed = useMemo(
    () =>
      queryString.parse(router.asPath.split("?")?.[1] || "", {
        parseBooleans: true,
        parseNumbers: true,
      }),
    [router.asPath],
  );
  const [value, setValue] = useState({
    ...defaultValue,
    ...router.query,
    ...parsed,
  });

  function set(query, { shallow = true } = {}) {
    setValue(query);

    let result = { ...value, ...query };

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
    set({ ...value, ...query }, { shallow });
  }

  return [value, set, update];
}
