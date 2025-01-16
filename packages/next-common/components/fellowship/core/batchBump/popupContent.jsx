import { useCallback, useState, memo } from "react";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { useContextApi } from "next-common/context/api";
import { useCoreFellowshipPallet } from "next-common/context/collectives/collectives";
import { rankColumn, memberColumn } from "./columns";
import { MapSelectableList } from "next-common/components/dataList/selectableList";
import fetchFellowshipCoreMembers2Times from "./fetchFellowshipCoreMembers2Times";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import useFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFellowshipCoreMembers";

function PopupContent({ expiredMembers, isLoading }) {
  const api = useContextApi();
  const pallet = useCoreFellowshipPallet();
  const defaultSelected = expiredMembers?.map((_, index) => index);
  const [selectedRows, setSelectedRows] = useState(defaultSelected);

  const dispatch = useDispatch();
  const { fetch } = useFellowshipCoreMembers();

  const getTxFunc = useCallback(() => {
    if (!api || selectedRows?.length === 0) {
      return;
    }

    const txs = selectedRows.map((rowIndex) =>
      api.tx[pallet].bump(expiredMembers[rowIndex].address),
    );

    return txs.length > 1 ? api.tx.utility.batch(txs) : txs[0];
  }, [api, pallet, selectedRows, expiredMembers]);

  const onFinalized = useCallback(async () => {
    try {
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

      await fetchFellowshipCoreMembers2Times(fetch);
    } catch (error) {
      throw new Error("Failed to update fellowship core members:", error);
    }
  }, [dispatch, fetch, selectedRows]);

  const columnsDef = [rankColumn, memberColumn];

  return (
    <>
      <div className="max-h-[450px]">
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
        onFinalized={onFinalized}
        disabled={selectedRows?.length === 0}
      />
    </>
  );
}

export default memo(PopupContent);
