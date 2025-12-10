import { MapDataList } from "../../../../dataList";
import { useMemo } from "react";
import { ValidatorsFilterProvider } from "../../../validatorsList/filter";
import useColumns from "../../../../styledList/useColumns";
import { colAccount, colCommission } from "../../../validatorsList/columns";
import {
  useValidators,
  useValidatorsWithIdentity,
} from "../../../validatorsList/hooks";

const columnsDef = [colAccount, colCommission];

function ValidatorsListImpl({ nominees, isLoading }) {
  const { validators, loading: isLoadingValidators } = useValidators();
  const nomineeValidators = useMemo(() => {
    if (!validators) {
      return null;
    }
    return validators.filter((v) => nominees.includes(v.account));
  }, [validators, nominees]);
  const {
    value: validatorsWithIdentity,
    loading: isLoadingValidatorsWithIdentity,
  } = useValidatorsWithIdentity(nomineeValidators);

  const { sortedColumn, sortDirection, columns } = useColumns(
    columnsDef,
    "Commission",
    true,
  );
  const sortedValidators = useMemo(() => {
    if (!validatorsWithIdentity) {
      return null;
    }
    if (!sortedColumn) {
      return validatorsWithIdentity;
    }
    const sorted = [...validatorsWithIdentity];
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
  }, [validatorsWithIdentity, sortedColumn, sortDirection]);

  return (
    <div className="flex flex-col gap-[16px]">
      <MapDataList
        columnsDef={columns}
        data={sortedValidators}
        loading={
          isLoading || isLoadingValidators || isLoadingValidatorsWithIdentity
        }
        noDataText="No current validators"
      />
    </div>
  );
}

export default function ValidatorsList({ nominees, isLoading }) {
  return (
    <ValidatorsFilterProvider>
      <ValidatorsListImpl nominees={nominees} isLoading={isLoading} />
    </ValidatorsFilterProvider>
  );
}
