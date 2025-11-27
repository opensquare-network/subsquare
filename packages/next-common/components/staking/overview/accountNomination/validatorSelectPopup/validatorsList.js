import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { MapDataList } from "../../../../dataList";
import ScrollerX from "../../../../styled/containers/scrollerX";
import { useMemo } from "react";
import { useListPagination } from "../../../../pagination/usePaginationComponent";
import {
  useFilteredValidators,
  ValidatorsFilter,
  ValidatorsFilterProvider,
} from "../../../validatorsList/filter";
import useSearchedValidators from "../../../validatorsList/search";
import useColumns from "../../../../styledList/useColumns";
import { colAccount, colCommission } from "../../../validatorsList/columns";
import {
  useValidators,
  useValidatorsWithIdentity,
} from "../../../validatorsList/hooks";
import { SystemPlus } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";

const PAGE_SIZE = 10;

function Header({ children }) {
  return (
    <div className="flex max-md:flex-col items-center gap-[24px] max-md:px-[24px] max-md:gap-[8px] max-md:mr-0">
      <div className="flex grow justify-between max-md:w-full">
        <div className="flex items-center gap-2 grow">
          <div className="grow">{children}</div>
          <ValidatorsFilter />
        </div>
      </div>
    </div>
  );
}

function ValidatorsListImpl({ nominees, setNominees }) {
  const { validators, loading: isLoadingValidators } = useValidators();
  const {
    value: validatorsWithIdentity,
    loading: isLoadingValidatorsWithIdentity,
  } = useValidatorsWithIdentity(validators);
  const filteredValidators = useFilteredValidators(validatorsWithIdentity);
  const skipSelectedValidators = useMemo(() => {
    if (!filteredValidators) {
      return null;
    }
    return filteredValidators.filter(
      (v) => !nominees || !nominees.includes(v.account),
    );
  }, [filteredValidators, nominees]);
  const { searchedValidators, component: searchBox } = useSearchedValidators(
    skipSelectedValidators,
  );

  const canAdd = (nominees?.length || 0) < 16;
  const columnsDef = useMemo(
    () => [
      colAccount,
      colCommission,
      {
        name: "",
        style: { textAlign: "right", width: "60px", minWidth: "60px" },
        render: (item) => (
          <div
            role="button"
            className={cn(
              "flex items-center gap-1 cursor-pointer text14Medium",
              canAdd
                ? "text-theme500 [&_svg_path]:stroke-theme500"
                : "text-textTertiary [&_svg_path]:stroke-textTertiary pointer-events-none",
            )}
            onClick={() => {
              if (!canAdd) {
                return;
              }
              setNominees((prev) => {
                if (prev.includes(item.account)) {
                  return prev;
                }
                return [...prev, item.account];
              });
            }}
          >
            <SystemPlus width={16} height={16} />
            <span>Add</span>
          </div>
        ),
      },
    ],
    [canAdd, setNominees],
  );

  const { sortedColumn, sortDirection, columns } = useColumns(
    columnsDef,
    "Commission",
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
      <Header>{searchBox}</Header>
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

export default function ValidatorsList({ nominees, setNominees }) {
  return (
    <ValidatorsFilterProvider>
      <ValidatorsListImpl nominees={nominees} setNominees={setNominees} />
    </ValidatorsFilterProvider>
  );
}
