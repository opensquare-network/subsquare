import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { MapDataList } from "../dataList";
import ScrollerX from "../styled/containers/scrollerX";
import { AddressUser } from "../user";
import { useAllValidators } from "next-common/hooks/staking/useAllValidators";
import { useActiveValidators } from "next-common/hooks/staking/useActiveValidators";
import { useMemo } from "react";
import { keyBy } from "lodash-es";
import { useListPagination } from "../pagination/usePaginationComponent";
import ValueDisplay from "../valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import ListTitleBar from "../listTitleBar";
import {
  DropdownFilterProvider,
  useCommittedFilterState,
} from "../dropdownFilter/context";
import { ValidatorsFilter } from "./filter";
import { useAsync } from "react-use";
import { fetchIdentity } from "next-common/services/identity";
import { getIdentityDisplay } from "next-common/utils/identity";
import useSearchedValidators from "./search";
import useColumns from "../styledList/useColumns";

const colAccount = {
  name: "Account",
  style: { textAlign: "left", minWidth: "240px" },
  render: (item) => <AddressUser key="account" add={item.account} />,
};

const colCommission = {
  name: "Commission",
  style: { textAlign: "left", width: "140px", minWidth: "140px" },
  sortable: true,
  render: (item) => (
    <span className="text-textPrimary">
      {(item.commission / 10000000).toFixed(2)}%
    </span>
  ),
};

function TotalStake({ item }) {
  const { symbol, decimals } = useChainSettings();
  if (item.total === undefined) {
    return <span className="text-textTertiary">-</span>;
  }
  return (
    <ValueDisplay value={toPrecision(item.total, decimals)} symbol={symbol} />
  );
}

const colTotalStake = {
  name: "Total Stake",
  style: { textAlign: "right", width: "140px", minWidth: "140px" },
  sortable: true,
  render: (item) => <TotalStake item={item} />,
};

function NominatorCount({ item }) {
  if (item.nominatorCount === undefined) {
    return <span className="text-textTertiary">-</span>;
  }
  return <span className="text-textPrimary">{item.nominatorCount}</span>;
}

const colNominatorCount = {
  name: "Nominator Count",
  style: { textAlign: "left", width: "140px", minWidth: "140px" },
  sortable: true,
  render: (item) => <NominatorCount item={item} />,
};

function useValidators() {
  const { validators: allValidators, loading: isAllValidatorsLoading } =
    useAllValidators();
  const { validators: activeValidators, loading: isActiveValidatorsLoading } =
    useActiveValidators();
  const validators = useMemo(() => {
    if (!allValidators || !activeValidators) {
      return null;
    }
    const activeValidatorsMap = keyBy(activeValidators, "account");
    return allValidators.map((validator) => ({
      ...validator,
      isActive: !!activeValidatorsMap[validator.account],
      ...(activeValidatorsMap[validator.account] || {}),
    }));
  }, [allValidators, activeValidators]);
  return {
    validators,
    loading: isAllValidatorsLoading || isActiveValidatorsLoading,
  };
}

function useFilteredValidators(validators) {
  const [{ active: isActive, not100Commission, hasIdentity }] =
    useCommittedFilterState();
  return useMemo(() => {
    if (!validators) {
      return null;
    }
    let filtered = isActive ? validators.filter((v) => v.isActive) : validators;
    filtered = not100Commission
      ? filtered.filter((v) => v.commission < 1000000000)
      : filtered;
    filtered = hasIdentity ? filtered.filter((v) => v.name) : filtered;
    return filtered;
  }, [validators, isActive, not100Commission, hasIdentity]);
}

function useValidatorsWithIdentity(validators) {
  const { identity: identityChain } = useChainSettings();
  return useAsync(async () => {
    if (!validators) {
      return null;
    }
    return await Promise.all(
      validators.map(async (validator) => {
        const identity = await fetchIdentity(identityChain, validator.account);
        const name = getIdentityDisplay(identity);
        return {
          ...validator,
          name,
        };
      }),
    );
  }, [identityChain, validators]);
}

const PAGE_SIZE = 50;

const columnsDef = [
  colAccount,
  colCommission,
  colNominatorCount,
  colTotalStake,
];

function Header({ count, children }) {
  return (
    <div className="flex max-md:flex-col items-center gap-[24px] max-md:px-[24px] max-md:gap-[8px] mr-6 max-md:mr-0">
      <div className="flex grow justify-between max-md:w-full">
        <ListTitleBar
          className={"max-md:-ml-6"}
          title="List"
          titleCount={count}
        />
        <div className="flex items-center gap-2">
          <div className="max-md:hidden">{children}</div>
          <ValidatorsFilter />
        </div>
      </div>
      <div className="md:hidden w-full">{children}</div>
    </div>
  );
}

function ValidatorsListImpl() {
  const { validators, loading: isLoadingValidators } = useValidators();
  const {
    value: validatorsWithIdentity,
    loading: isLoadingValidatorsWithIdentity,
  } = useValidatorsWithIdentity(validators);
  const filteredValidators = useFilteredValidators(validatorsWithIdentity);
  const { searchedValidators, component: searchBox } =
    useSearchedValidators(filteredValidators);

  const { sortedColumn, sortDirection, columns } = useColumns(
    columnsDef,
    "",
    true,
    true,
  );
  const sortedValidators = useMemo(() => {
    if (!searchedValidators) {
      return null;
    }
    if (!sortedColumn) {
      return searchedValidators;
    }
    const sorted = [...searchedValidators];
    sorted.sort((a, b) => {
      let aValue, bValue, diff;
      switch (sortedColumn) {
        case colCommission.name:
          aValue = a.commission;
          bValue = b.commission;
          diff = bValue - aValue;
          break;
        case colNominatorCount.name:
          aValue = a.nominatorCount || 0;
          bValue = b.nominatorCount || 0;
          diff = bValue - aValue;
          break;
        case colTotalStake.name:
          aValue = BigInt(a.total || 0);
          bValue = BigInt(b.total || 0);
          diff = bValue - aValue > 0n ? 1 : bValue - aValue < 0n ? -1 : 0;
          break;
        default:
          diff = 0;
          break;
      }
      return sortDirection === "asc" ? -diff : diff;
    });
    return sorted;
  }, [searchedValidators, sortedColumn, sortDirection]);

  const { pagedItems: pagedValidators, component: pagination } =
    useListPagination(sortedValidators, PAGE_SIZE);

  return (
    <div className="flex flex-col gap-[16px]">
      <Header count={searchedValidators?.length || 0}>{searchBox}</Header>
      <SecondaryCard>
        <ScrollerX>
          <MapDataList
            columnsDef={columns}
            data={pagedValidators}
            loading={isLoadingValidators || isLoadingValidatorsWithIdentity}
            noDataText="No current validators"
          />
        </ScrollerX>
        {pagination}
      </SecondaryCard>
    </div>
  );
}

export default function ValidatorsList() {
  return (
    <DropdownFilterProvider
      defaultFilterValues={{
        active: true,
        not100Commission: true,
        hasIdentity: true,
      }}
      emptyFilterValues={{
        active: false,
        not100Commission: false,
        hasIdentity: false,
      }}
    >
      <ValidatorsListImpl />
    </DropdownFilterProvider>
  );
}
