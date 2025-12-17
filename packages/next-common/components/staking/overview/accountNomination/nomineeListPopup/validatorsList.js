import { MapDataList } from "../../../../dataList";
import { useMemo } from "react";
import { ValidatorsFilterProvider } from "../../../validatorsList/filter";
import useColumns from "../../../../styledList/useColumns";
import { colAccount, colCommission } from "../../../validatorsList/columns";
import { useValidators } from "next-common/context/staking/validators";
import { useValidatorsWithIdentity } from "../../../validatorsList/hooks";
import { SystemVoteAye, SystemVoteNay } from "@osn/icons/subsquare";

function ValidatorsListImpl({
  nominees,
  activeNominees,
  isLoading,
  titleClassName,
  contentClassName,
}) {
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

  const columnsDef = useMemo(
    () => [
      colAccount,
      colCommission,
      {
        name: "Elected",
        style: { textAlign: "right", width: "80px", minWidth: "80px" },
        render: (item) => (
          <div className="inline-block">
            {activeNominees.includes(item.account) ? (
              <SystemVoteAye className="w-5 h-5" />
            ) : (
              <SystemVoteNay className="w-5 h-5" />
            )}
          </div>
        ),
      },
    ],
    [activeNominees],
  );

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
    <div className="flex flex-col w-full">
      <MapDataList
        titleClassName={titleClassName}
        contentClassName={contentClassName}
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

export default function ValidatorsList({
  nominees,
  activeNominees,
  isLoading,
  titleClassName,
  contentClassName,
}) {
  return (
    <ValidatorsFilterProvider>
      <ValidatorsListImpl
        nominees={nominees}
        activeNominees={activeNominees}
        isLoading={isLoading}
        titleClassName={titleClassName}
        contentClassName={contentClassName}
      />
    </ValidatorsFilterProvider>
  );
}
