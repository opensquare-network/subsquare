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
import { omit, pick } from "lodash-es";

const [useDropdownFilterState, DropdownFilterStateProvider] =
  createStateContext(false);

const [useStagedFilterState, StagedFilterStateProvider] = createStateContext(
  {},
);

const DefaultFilterValuesContext = createContext();

function DefaultFilterValuesProvider({
  defaultFilterValues = {},
  emptyFilterValues = {},
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
  const { emptyFilterValues } = useContext(DefaultFilterValuesContext);
  return emptyFilterValues;
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
    const urlQueryNames = Object.keys(emptyFilterValues);
    const urlFilters = {
      ...defaultFilterValues,
      ...pick(router.query, urlQueryNames),
    };
    const otherFilters = omit(router.query, urlQueryNames);
    const filterValues = subtractObject(urlFilters, emptyFilterValues);
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
            ...subtractObject(newFilters, defaultFilterValues),
          },
        },
        undefined,
        { shallow: true },
      );
    },
    [router, otherFilters, defaultFilterValues],
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
  defaultFilterValues,
  emptyFilterValues,
  children,
}) {
  return (
    <DropdownFilterStateProvider>
      <DefaultFilterValuesProvider
        defaultFilterValues={defaultFilterValues}
        emptyFilterValues={emptyFilterValues}
      >
        <CommittedFilterStateProvider>
          <StagedFilterStateProvider>{children}</StagedFilterStateProvider>
        </CommittedFilterStateProvider>
      </DefaultFilterValuesProvider>
    </DropdownFilterStateProvider>
  );
}

export function DropdownUrlFilterProvider({
  defaultFilterValues,
  emptyFilterValues,
  children,
}) {
  return (
    <DropdownFilterStateProvider>
      <DefaultFilterValuesProvider
        defaultFilterValues={defaultFilterValues}
        emptyFilterValues={emptyFilterValues}
      >
        <UrlFilterStateProvider>
          <StagedFilterStateProvider>{children}</StagedFilterStateProvider>
        </UrlFilterStateProvider>
      </DefaultFilterValuesProvider>
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
  const defaultFilterValues = useDefaultFilterValues();

  return (
    <SecondaryButton
      size="small"
      onClick={() => {
        setStagedFilter(defaultFilterValues);
        setCommittedFilter(defaultFilterValues);
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
