import { entries, isNil } from "lodash-es";
import { useRouter } from "next/router";
import queryString from "query-string";
import { useEffect, useMemo } from "react";
import { createGlobalState } from "react-use";

const useValueState = createGlobalState({});

/**
 * @returns {[typeof router.query, set, update]}
 */
export function useUrlSearchParams({
  removeNullishValues = true,
  removeFalsyValues = false,
  defaultValue = {},
} = {}) {
  const [value, setValue] = useValueState();

  const router = useRouter();
  const parsed = useMemo(
    () =>
      queryString.parse(router.asPath.split("?")?.[1] || "", {
        parseBooleans: true,
        parseNumbers: true,
      }),
    [router.asPath],
  );
  useEffect(() => {
    setValue({
      ...defaultValue,
      ...value,
      ...router.query,
      ...parsed,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsed, router.query]);

  function set(query, { shallow = true } = {}) {
    setValue(query);

    let result = { ...query };

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
    set({ ...value, ...parsed, ...query }, { shallow });
  }

  return [value, set, update];
}
