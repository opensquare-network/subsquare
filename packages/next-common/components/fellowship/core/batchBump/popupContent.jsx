import { useCallback, useState, memo } from "react";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { useContextApi } from "next-common/context/api";
import { useCoreFellowshipPallet } from "next-common/context/collectives/collectives";
import useCoreFellowshipUpdateFunc from "next-common/components/collectives/core/updateFunc";
import { rankColumn, memberColumn } from "./columns";
import { MapSelectableList } from "next-common/components/dataList/selectableList";

function PopupContent({ expiredMembers, isLoading }) {
  const api = useContextApi();
  const pallet = useCoreFellowshipPallet();
  const defaultSelected = expiredMembers?.map((_, index) => index);
  const [selectedRows, setSelectedRows] = useState(defaultSelected);

  const getTxFunc = useCallback(() => {
    if (!api || selectedRows?.length === 0) {
      return;
    }

    const txs = selectedRows.map((rowIndex) =>
      api.tx[pallet].bump(expiredMembers[rowIndex].address),
    );

    return txs.length > 1 ? api.tx.utility.batch(txs) : txs[0];
  }, [api, pallet, selectedRows, expiredMembers]);

  const onInBlock = useCoreFellowshipUpdateFunc();

  const desktopColumnsDef = [rankColumn, memberColumn];

  return (
    <>
      <div className="max-h-[450px]">
        <MapSelectableList
          columnsDef={desktopColumnsDef}
          data={expiredMembers}
          loading={isLoading}
          noDataText="No members can be demoted."
          className="max-h-[450px] overflow-auto"
          setSelectedRows={setSelectedRows}
          selectedRows={selectedRows}
        />
      </div>
      <TxSubmissionButton
        getTxFunc={getTxFunc}
        onInBlock={onInBlock}
        onFinalized={onInBlock}
        disabled={selectedRows?.length === 0}
      />
    </>
  );
}

export default memo(PopupContent);
