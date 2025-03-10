import { useCallback, useState, memo, useEffect, useMemo } from "react";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { useContextApi } from "next-common/context/api";
import { useCoreFellowshipPallet } from "next-common/context/collectives/collectives";
import { rankColumn, memberColumn } from "./columns";
import { MapSelectableList } from "next-common/components/dataList/selectableList";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";
// import ExtensionUpdatePrompt from "next-common/components/overview/accountInfo/components/extensionUpdatePrompt";

function PopupContent({ expiredMembers, isLoading, onInBlock, onFinalized }) {
  const api = useContextApi();
  const pallet = useCoreFellowshipPallet();
  const defaultSelected = useMemo(
    () => expiredMembers?.map((_, index) => index),
    [expiredMembers],
  );
  const [selectedRows, setSelectedRows] = useState(defaultSelected);
  useEffect(() => {
    setSelectedRows(defaultSelected);
  }, [defaultSelected]);

  const dispatch = useDispatch();

  const getTxFunc = useCallback(() => {
    if (!api || selectedRows?.length === 0) {
      return;
    }

    const txs = selectedRows.map((rowIndex) =>
      api.tx[pallet].bump(expiredMembers[rowIndex].address),
    );

    return txs.length > 1 ? api.tx.utility.batch(txs) : txs[0];
  }, [api, pallet, selectedRows, expiredMembers]);

  const _onFinalized = useCallback(async () => {
    const memberCount = selectedRows?.length || 0;
    if (memberCount === 0) {
      return;
    }

    dispatch(
      newSuccessToast(
        `${memberCount} ${
          memberCount > 1 ? "members" : "member"
        } demoted successfully`,
      ),
    );

    if (onFinalized) {
      await onFinalized();
    }
  }, [dispatch, selectedRows, onFinalized]);

  const columnsDef = [rankColumn, memberColumn];

  return (
    <>
      <div className="max-h-[450px]">
        {/* <ExtensionUpdatePrompt isWithCache={false} /> */}

        <MapSelectableList
          columnsDef={columnsDef}
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
        onFinalized={_onFinalized}
        disabled={selectedRows?.length === 0}
      />
    </>
  );
}

export default memo(PopupContent);
