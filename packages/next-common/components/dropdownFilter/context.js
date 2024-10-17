import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { createStateContext } from "react-use";
import { useRouter } from "next/router";
import { omit, pick } from "lodash-es";

const [useDropdownDisplayState, DropdownDisplayStateProvider] =
  createStateContext(false);

const [useStagedFilterState, StagedFilterStateProvider] = createStateContext(
  {},
);

const DefaultFilterValuesContext = createContext();

function DefaultFilterValuesProvider({
  defaultFilterValues = {},
  emptyFilterValues,
  children,
}) {
  return (
    <DefaultFilterValuesContext.Provider
      value={{ defaultFilterValues, emptyFilterValues }}
    >
      {children}
    </DefaultFilterValuesContext.Provider>
  );
}

function useDefaultFilterValues() {
  const { defaultFilterValues } = useContext(DefaultFilterValuesContext);
  return defaultFilterValues;
}

function useEmptyFilterValues() {
  const { emptyFilterValues, defaultFilterValues } = useContext(
    DefaultFilterValuesContext,
  );
  return emptyFilterValues || defaultFilterValues;
}

const CommittedFilterStateContext = createContext();

function subtractObject(a, b) {
  return Object.fromEntries(
    Object.entries(a).filter(
      ([key, value]) => value.toString() !== b[key].toString(),
    ),
  );
}

function useCommittedFilterState() {
  const emptyFilterValues = useEmptyFilterValues();
  const [filterState, setFilterState] = useContext(CommittedFilterStateContext);

  const normalizedFilterState = useMemo(
    () => subtractObject(filterState, emptyFilterValues),
    [filterState, emptyFilterValues],
  );

  return [normalizedFilterState, setFilterState];
}

function CommittedFilterStateProvider({ children }) {
  const defaultFilterValues = useDefaultFilterValues();
  const [filterState, setFilterState] = useState(defaultFilterValues);
  return (
    <CommittedFilterStateContext.Provider value={[filterState, setFilterState]}>
      {children}
    </CommittedFilterStateContext.Provider>
  );
}

function UrlFilterStateProvider({ children }) {
  const router = useRouter();
  const defaultFilterValues = useDefaultFilterValues();
  const emptyFilterValues = useEmptyFilterValues();

  const { otherFilters, filterValues } = useMemo(() => {
    const urlQueryNames = Object.keys(defaultFilterValues);
    const otherFilters = omit(router.query, urlQueryNames);
    const filterValues = subtractObject(
      {
        ...defaultFilterValues,
        ...pick(router.query, urlQueryNames),
      },
      emptyFilterValues,
    );
    return {
      otherFilters,
      filterValues,
    };
  }, [router, defaultFilterValues, emptyFilterValues]);

  const setUrlFilters = useCallback(
    (newFilters) => {
      router.push(
        {
          pathname: router.pathname,
          query: {
            ...otherFilters,
            ...subtractObject(
              { ...emptyFilterValues, ...newFilters },
              defaultFilterValues,
            ),
          },
        },
        undefined,
        { shallow: true },
      );
    },
    [router, otherFilters, emptyFilterValues, defaultFilterValues],
  );

  return (
    <CommittedFilterStateContext.Provider value={[filterValues, setUrlFilters]}>
      {children}
    </CommittedFilterStateContext.Provider>
  );
}

function DropdownFilterProvider({
  defaultFilterValues,
  emptyFilterValues,
  children,
}) {
  return (
    <DropdownDisplayStateProvider>
      <DefaultFilterValuesProvider
        defaultFilterValues={defaultFilterValues}
        emptyFilterValues={emptyFilterValues}
      >
        <CommittedFilterStateProvider>
          <StagedFilterStateProvider>{children}</StagedFilterStateProvider>
        </CommittedFilterStateProvider>
      </DefaultFilterValuesProvider>
    </DropdownDisplayStateProvider>
  );
}

function DropdownUrlFilterProvider({
  defaultFilterValues,
  emptyFilterValues,
  children,
}) {
  return (
    <DropdownDisplayStateProvider>
      <DefaultFilterValuesProvider
        defaultFilterValues={defaultFilterValues}
        emptyFilterValues={emptyFilterValues}
      >
        <UrlFilterStateProvider>
          <StagedFilterStateProvider>{children}</StagedFilterStateProvider>
        </UrlFilterStateProvider>
      </DefaultFilterValuesProvider>
    </DropdownDisplayStateProvider>
  );
}

export {
  useDefaultFilterValues,
  useDropdownDisplayState,
  useCommittedFilterState,
  useStagedFilterState,
  DropdownFilterProvider,
  DropdownUrlFilterProvider,
};
