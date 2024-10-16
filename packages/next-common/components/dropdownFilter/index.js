import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createStateContext, useClickAway } from "react-use";
import { SystemFilter } from "@osn/icons/subsquare";
import { OptionsPadRightWrapper } from "../select/styled";
import SecondaryButton from "next-common/lib/button/secondary";
import PrimaryButton from "next-common/lib/button/primary";
import { useRouter } from "next/router";
import { isNil, omit, pick } from "lodash-es";

const [useDropdownFilterState, DropdownFilterStateProvider] =
  createStateContext(false);

const [useStagedFilterState, StagedFilterStateProvider] = createStateContext(
  {},
);

const InitialFiltersContext = createContext();

function InitialFiltersProvider({
  initialFilters = {},
  emptyFilterValues = {},
  children,
}) {
  return (
    <InitialFiltersContext.Provider
      value={{ initialFilters, emptyFilterValues }}
    >
      {children}
    </InitialFiltersContext.Provider>
  );
}

function useInitialFilters() {
  const { initialFilters } = useContext(InitialFiltersContext);
  return initialFilters;
}

function useEmptyFilterValues() {
  const { emptyFilterValues } = useContext(InitialFiltersContext);
  return emptyFilterValues;
}

const CommittedFilterStateContext = createContext();

function useCommittedFilterState() {
  return useContext(CommittedFilterStateContext);
}

function CommittedFilterStateProvider({ children }) {
  const initialFilters = useInitialFilters();
  const [filterState, setFilterState] = useState(initialFilters);
  return (
    <CommittedFilterStateContext.Provider value={[filterState, setFilterState]}>
      {children}
    </CommittedFilterStateContext.Provider>
  );
}

function UrlFilterStateProvider({ urlQueryNames = [], children }) {
  const router = useRouter();
  const initialFilters = useInitialFilters();
  const emptyFilterValues = useEmptyFilterValues();

  const { otherFilters, filterValues } = useMemo(() => {
    const urlFilters = {
      ...initialFilters,
      ...pick(router.query, urlQueryNames),
    };
    const otherFilters = omit(router.query, urlQueryNames);
    const filterValues = Object.fromEntries(
      urlQueryNames
        .filter(
          (key) =>
            !isNil(urlFilters[key]) &&
            urlFilters[key].toString() !== emptyFilterValues[key]?.toString(),
        )
        .map((key) => [key, urlFilters[key]]),
    );

    return {
      otherFilters,
      filterValues,
    };
  }, [router, urlQueryNames, initialFilters, emptyFilterValues]);

  const setUrlFilters = useCallback(
    (newFilters) => {
      router.push(
        {
          pathname: router.pathname,
          query: {
            ...otherFilters,
            ...pick(newFilters, urlQueryNames),
          },
        },
        undefined,
        { shallow: true },
      );
    },
    [router, otherFilters, urlQueryNames],
  );

  return (
    <CommittedFilterStateContext.Provider value={[filterValues, setUrlFilters]}>
      {children}
    </CommittedFilterStateContext.Provider>
  );
}

export {
  useDropdownFilterState,
  useCommittedFilterState,
  useStagedFilterState,
};

export function DropdownFilterProvider({
  initialFilters,
  emptyFilterValues,
  children,
}) {
  return (
    <DropdownFilterStateProvider>
      <InitialFiltersProvider
        initialFilters={initialFilters}
        emptyFilterValues={emptyFilterValues}
      >
        <CommittedFilterStateProvider>
          <StagedFilterStateProvider>{children}</StagedFilterStateProvider>
        </CommittedFilterStateProvider>
      </InitialFiltersProvider>
    </DropdownFilterStateProvider>
  );
}

export function DropdownUrlFilterProvider({
  urlQueryNames,
  initialFilters,
  emptyFilterValues,
  children,
}) {
  return (
    <DropdownFilterStateProvider>
      <InitialFiltersProvider
        initialFilters={initialFilters}
        emptyFilterValues={emptyFilterValues}
      >
        <UrlFilterStateProvider urlQueryNames={urlQueryNames}>
          <StagedFilterStateProvider>{children}</StagedFilterStateProvider>
        </UrlFilterStateProvider>
      </InitialFiltersProvider>
    </DropdownFilterStateProvider>
  );
}

function DropdownFilterPanel({ children }) {
  const [committedFilter] = useCommittedFilterState();
  const [, setStagedFilter] = useStagedFilterState();

  useEffect(() => {
    setStagedFilter(committedFilter);
  }, [committedFilter, setStagedFilter]);

  return <OptionsPadRightWrapper>{children}</OptionsPadRightWrapper>;
}

export function ApplyFilterButton() {
  const [, setCommittedFilter] = useCommittedFilterState();
  const [stagedFilter] = useStagedFilterState();
  const [, setShowDropdown] = useDropdownFilterState();

  return (
    <PrimaryButton
      size="small"
      onClick={() => {
        setCommittedFilter(stagedFilter);
        setShowDropdown(false);
      }}
    >
      Apply
    </PrimaryButton>
  );
}

export function ResetFilterButton() {
  const [, setStagedFilter] = useStagedFilterState();
  const [, setCommittedFilter] = useCommittedFilterState();
  const [, setShowDropdown] = useDropdownFilterState();
  const initialFilters = useInitialFilters();

  return (
    <SecondaryButton
      size="small"
      onClick={() => {
        setStagedFilter(initialFilters);
        setCommittedFilter(initialFilters);
        setShowDropdown(false);
      }}
    >
      Reset
    </SecondaryButton>
  );
}

function FilterContentWrapper({ children }) {
  return (
    <div className="flex flex-col p-[16px] gap-[16px]">
      <span className="text12Bold text-textPrimary">Conditions</span>
      <div>{children}</div>
      <div className="flex justify-end gap-[8px]">
        <ResetFilterButton />
        <ApplyFilterButton />
      </div>
    </div>
  );
}

export function DropdownFilter({ name = "Filter", children }) {
  const [showDropdown, setShowDropdown] = useDropdownFilterState();
  const ref = useRef();
  useClickAway(ref, () => setShowDropdown(false));
  const [filters] = useCommittedFilterState();

  const numFilters = Object.keys(filters).length;

  return (
    <div ref={ref} className="relative">
      <SecondaryButton
        size="small"
        iconLeft={<SystemFilter className="w-4 h-4" />}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div className="flex items-center gap-[4px] text12Medium">
          <span className="text-textPrimary">{name}</span>
          {numFilters > 0 && (
            <span className="text-textTertiary">{numFilters}</span>
          )}
        </div>
      </SecondaryButton>
      {showDropdown && <DropdownFilterPanel>{children}</DropdownFilterPanel>}
    </div>
  );
}

export function CommonDropdownFilter({ children }) {
  return (
    <DropdownFilter>
      <FilterContentWrapper>{children}</FilterContentWrapper>
    </DropdownFilter>
  );
}
