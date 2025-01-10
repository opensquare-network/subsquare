import { useCallback, useMemo, useState, memo } from "react";
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
  AllRowsCheckBox,
} from "./columns";
import Divider from "next-common/components/styled/layout/divider";

function PopupContent({ expiredMembers, isLoading }) {
  const api = useContextApi();
  const pallet = useCoreFellowshipPallet();
  const [selected, setSelected] = useState(
    expiredMembers.reduce((acc, member) => {
      acc[member.address] = true;
      return acc;
    }, {}),
  );

  const onChange = (value) => {
    setSelected(value);
  };

  const selectedMembers = useMemo(
    () => expiredMembers.filter((member) => selected[member.address]),
    [expiredMembers, selected],
  );

  const getTxFunc = useCallback(() => {
    if (!api || selectedMembers?.length === 0) {
      return;
    }

    const txs = selectedMembers.map((member) =>
      api.tx[pallet].bump(member.address),
    );

    return txs.length > 1 ? api.tx.utility.batch(txs) : txs[0];
  }, [api, pallet, selectedMembers]);

  const onInBlock = useCoreFellowshipUpdateFunc();
  const allSelected = Object.values(selected).every((v) => v);

  const operationDesktopColumn = operationDesktopColumnFunc(
    selected,
    onChange,
    expiredMembers,
    allSelected,
  );
  const operationMobileColumn = operationMobileColumnFunc(selected, onChange);

  const desktopColumnsDef = [rankColumn, memberColumn, operationDesktopColumn];
  const mobileColumnsDef = [rankColumn, memberColumn, operationMobileColumn];

  return (
    <>
      <div className="hidden max-sm:flex flex-col items-end">
        <AllRowsCheckBox
          expiredMembers={expiredMembers}
          defaultValue={allSelected}
          onSelected={onChange}
        />
      </div>
      <Divider className="hidden max-sm:flex my-4" />
      <div className="max-h-[450px]">
        <MapDataList
          columnsDef={desktopColumnsDef}
          data={expiredMembers}
          loading={isLoading}
          noDataText="No members can be demoted."
          className="max-sm:hidden max-h-[450px] h-full overflow-auto"
        />
        <MapDataList
          columnsDef={mobileColumnsDef}
          data={expiredMembers}
          loading={isLoading}
          noDataText="No members can be demoted."
          className="hidden max-sm:block max-h-[450px] h-full overflow-auto"
        />
      </div>
      <TxSubmissionButton
        getTxFunc={getTxFunc}
        onInBlock={onInBlock}
        onFinalized={onInBlock}
        disabled={selectedMembers?.length === 0}
      />
    </>
  );
}

export default memo(PopupContent);
