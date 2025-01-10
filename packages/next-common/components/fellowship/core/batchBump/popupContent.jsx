import { useCallback, useState, memo } from "react";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { useContextApi } from "next-common/context/api";
import { useCoreFellowshipPallet } from "next-common/context/collectives/collectives";
import useCoreFellowshipUpdateFunc from "next-common/components/collectives/core/updateFunc";
import { MapDataList } from "next-common/components/dataList";
import {
  rankColumn,
  memberColumn,
  operationDesktopColumnFunc,
  operationMobileColumnFunc,
} from "./columns";
import Divider from "next-common/components/styled/layout/divider";
import Checkbox from "next-common/components/checkbox";
import { useNavCollapsed } from "next-common/context/nav";
import { cn } from "next-common/utils";

function getSelectedMembers(members) {
  return (
    Object.entries(members)
      .filter(([, value]) => value)
      .map(([key]) => key) || []
  );
}

function PopupContent({ expiredMembers, isLoading }) {
  const [navCollapsed] = useNavCollapsed();
  const api = useContextApi();
  const pallet = useCoreFellowshipPallet();
  const defaultSelected = expiredMembers.reduce((acc, member) => {
    acc[member.address] = true;
    return acc;
  }, {});
  const [selected, setSelected] = useState(defaultSelected);
  const [isSumbitDisabled, setIsSumbitDisabled] = useState(
    getSelectedMembers(defaultSelected)?.length === 0,
  );

  let allSelected = Object.values(selected).every((v) => v);

  const toggleAllSelection = (isAllSelected) => {
    const value = expiredMembers.reduce((acc, member) => {
      acc[member.address] = !isAllSelected;
      return acc;
    }, {});

    onChange(value);
  };

  const onChange = (newSelected) => {
    if (
      Object.values(newSelected).every((v) => v) ||
      Object.values(newSelected).every((v) => !v)
    ) {
      allSelected = Object.values(newSelected).every((v) => v);
      setSelected((prev) => ({ ...prev, ...newSelected }));
    } else {
      setSelected(newSelected);
    }
    setIsSumbitDisabled(getSelectedMembers(newSelected)?.length === 0);
  };

  const getTxFunc = useCallback(() => {
    const selectedMembers = getSelectedMembers(selected);
    if (!api || selectedMembers?.length === 0) {
      return;
    }

    const txs = selectedMembers.map((member) => api.tx[pallet].bump(member));

    return txs.length > 1 ? api.tx.utility.batch(txs) : txs[0];
  }, [api, pallet, selected]);

  const onInBlock = useCoreFellowshipUpdateFunc();

  const operationDesktopColumn = operationDesktopColumnFunc(
    selected,
    onChange,
    allSelected,
    toggleAllSelection,
  );
  const operationMobileColumn = operationMobileColumnFunc(selected, onChange);

  const desktopColumnsDef = [rankColumn, memberColumn, operationDesktopColumn];
  const mobileColumnsDef = [rankColumn, memberColumn, operationMobileColumn];

  return (
    <>
      <div
        className={cn(
          "hidden",
          navCollapsed
            ? "max-sm:flex flex-col items-end"
            : "max-md:flex flex-col items-end",
        )}
      >
        <Checkbox
          checked={allSelected}
          onClick={() => toggleAllSelection(allSelected)}
          className="w-4 h-4 cursor-pointer"
        />
      </div>
      <Divider
        className={cn(
          "hidden",
          navCollapsed ? "max-sm:flex my-4" : "max-md:flex my-4",
        )}
      />
      <div className="max-h-[450px]">
        <MapDataList
          columnsDef={desktopColumnsDef}
          data={expiredMembers}
          loading={isLoading}
          noDataText="No members can be demoted."
          className={cn(
            "max-h-[450px] overflow-auto block",
            navCollapsed ? "max-sm:hidden" : "max-md:hidden",
          )}
        />
        <MapDataList
          columnsDef={mobileColumnsDef}
          data={expiredMembers}
          loading={isLoading}
          noDataText="No members can be demoted."
          className={cn(
            "max-h-[450px] overflow-auto hidden",
            navCollapsed ? "max-sm:block" : "max-md:block",
          )}
        />
      </div>
      <TxSubmissionButton
        getTxFunc={getTxFunc}
        onInBlock={onInBlock}
        onFinalized={onInBlock}
        disabled={isSumbitDisabled}
      />
    </>
  );
}

export default memo(PopupContent);
