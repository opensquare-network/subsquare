import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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

const CommittedFilterStateContext = createContext();

function useCommittedFilterState() {
  return useContext(CommittedFilterStateContext);
}

function CommittedFilterStateProvider({ children }) {
  const [filterState, setFilterState] = useState({});
  return (
    <CommittedFilterStateContext.Provider value={[filterState, setFilterState]}>
      {children}
    </CommittedFilterStateContext.Provider>
  );
}

function UrlFilterStateProvider({ urlQueryNames = [], children }) {
  const router = useRouter();

  const urlFilters = pick(router.query, urlQueryNames);
  const otherFilters = omit(router.query, urlQueryNames);

  const setUrlFilters = useCallback(
    (newFilters) => {
      router.push(
        {
          pathname: router.pathname,
          query: { ...otherFilters, ...pick(newFilters, urlQueryNames) },
        },
        undefined,
        { shallow: true },
      );
    },
    [router, otherFilters, urlQueryNames],
  );

  return (
    <CommittedFilterStateContext.Provider value={[urlFilters, setUrlFilters]}>
      {children}
    </CommittedFilterStateContext.Provider>
  );
}

export {
  useDropdownFilterState,
  useCommittedFilterState,
  useStagedFilterState,
};

export function DropdownFilterProvider({ children }) {
  return (
    <DropdownFilterStateProvider>
      <CommittedFilterStateProvider>
        <StagedFilterStateProvider>{children}</StagedFilterStateProvider>
      </CommittedFilterStateProvider>
    </DropdownFilterStateProvider>
  );
}

export function DropdownUrlFilterProvider({ urlQueryNames, children }) {
  return (
    <DropdownFilterStateProvider>
      <UrlFilterStateProvider urlQueryNames={urlQueryNames}>
        <StagedFilterStateProvider>{children}</StagedFilterStateProvider>
      </UrlFilterStateProvider>
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
  const [committedFilter] = useCommittedFilterState();
  const [, setStagedFilter] = useStagedFilterState();

  return (
    <SecondaryButton
      size="small"
      onClick={() => setStagedFilter(committedFilter)}
    >
      Reset
    </SecondaryButton>
  );
}

export function FilterContentWrapper({ children }) {
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
