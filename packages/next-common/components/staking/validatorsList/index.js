import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { MapDataList } from "../../dataList";
import ScrollerX from "../../styled/containers/scrollerX";
import { useMemo } from "react";
import { useListPagination } from "../../pagination/usePaginationComponent";
import ListTitleBar from "../../listTitleBar";
import {
  useFilteredValidators,
  ValidatorsFilter,
  ValidatorsFilterProvider,
} from "./filter";
import useSearchedValidators from "./search";
import useColumns from "../../styledList/useColumns";
import {
  colAccount,
  colCommission,
  colNominatorCount,
  colSelfStake,
  colTotalStake,
} from "./columns";
import { useValidators, useValidatorsWithIdentity } from "./hooks";

const PAGE_SIZE = 50;

const columnsDef = [
  colAccount,
  colCommission,
  colNominatorCount,
  colSelfStake,
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
        case colSelfStake.name:
          aValue = BigInt(a.own || 0);
          bValue = BigInt(b.own || 0);
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
    <ValidatorsFilterProvider>
      <ValidatorsListImpl />
    </ValidatorsFilterProvider>
  );
}
