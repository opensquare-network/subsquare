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
import { useValidatorsWithIdentity } from "../../../validatorsList/hooks";
import { SystemPlus } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";
import { useValidators } from "next-common/context/staking/validators";

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
  const { searchedValidators, component: searchBox } =
    useSearchedValidators(filteredValidators);

  const selectedAccounts = useMemo(() => new Set(nominees || []), [nominees]);
  const canAdd = (nominees?.length || 0) < 16;
  // Keep selected validators in place and only grey them out,
  // so the list (and its pagination) stays stable while adding.
  const columnsDef = useMemo(() => {
    const renderDimmedIfSelected = (render, item) => {
      if (!selectedAccounts.has(item.account)) {
        return render(item);
      }
      return <div className="opacity-50">{render(item)}</div>;
    };

    return [
      {
        ...colAccount,
        render: (item) => renderDimmedIfSelected(colAccount.render, item),
      },
      {
        ...colCommission,
        render: (item) => renderDimmedIfSelected(colCommission.render, item),
      },
      {
        name: "",
        style: { textAlign: "right", width: "60px", minWidth: "60px" },
        render: (item) => {
          const disabled = !canAdd || selectedAccounts.has(item.account);
          return (
            <div
              role="button"
              className={cn(
                "flex items-center gap-1 text14Medium",
                disabled
                  ? "cursor-default text-textTertiary [&_svg_path]:stroke-textTertiary pointer-events-none"
                  : "cursor-pointer text-theme500 [&_svg_path]:stroke-theme500",
              )}
              onClick={() => {
                if (disabled) {
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
          );
        },
      },
    ];
  }, [canAdd, setNominees, selectedAccounts]);

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
