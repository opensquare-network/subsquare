import PopupWithSigner from "next-common/components/popupWithSigner";
import { useCallback, useMemo, useRef, useState, memo } from "react";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { useContextApi } from "next-common/context/api";
import { useCoreFellowshipPallet } from "next-common/context/collectives/collectives";
import useCoreFellowshipUpdateFunc from "next-common/components/collectives/core/updateFunc";
import { MapDataList } from "next-common/components/dataList";
import { useCoreMembersWithRankContext } from "next-common/components/collectives/core/context/coreMembersWithRankContext";
import { partition } from "lodash-es";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { useSelector } from "react-redux";
import { useCoreFellowshipParams } from "next-common/context/collectives/collectives";
import { isDemotionExpired } from "next-common/utils/collective/demotionAndPromotion";
import {
  rankColumn,
  memberColumn,
  operationDesktopColumnFunc,
  operationMobileColumnFunc,
} from "./columns";
import { isEqual } from "lodash-es";
import Checkbox from "next-common/components/checkbox";
import Divider from "next-common/components/styled/layout/divider";

function useDemotionExpiredMembers() {
  const { coreMembers, isLoading } = useCoreMembersWithRankContext();

  const [members] = useMemo(
    () => partition(coreMembers, (m) => m.rank > 0),
    [coreMembers],
  );

  const latestHeight = useSelector(chainOrScanHeightSelector);
  const params = useCoreFellowshipParams();
  const expiredMembersRef = useRef([]);

  const expiredMembers = useMemo(() => {
    const newExpiredMembers = (members || []).filter((coreMember) => {
      const {
        status: { lastProof },
        rank,
      } = coreMember;

      return isDemotionExpired({ lastProof, rank, params, latestHeight });
    });

    if (!isEqual(newExpiredMembers, expiredMembersRef.current)) {
      expiredMembersRef.current = newExpiredMembers;
    }

    return expiredMembersRef.current;
  }, [members, latestHeight, params]);

  return {
    expiredMembers,
    isLoading,
  };
}

function Content({ expiredMembers, isLoading }) {
  const api = useContextApi();
  const pallet = useCoreFellowshipPallet();
  const [selected, setSelected] = useState(
    expiredMembers.reduce((acc, member) => {
      acc[member.address] = true;
      return acc;
    }, {}),
  );

  const toggleSelection = useCallback(
    (address) => {
      setSelected((prev) => ({
        ...prev,
        [address]: !prev[address],
      }));
    },
    [setSelected],
  );

  const toggleAllSelection = useCallback(
    (isAllSelected) => {
      setSelected(() =>
        expiredMembers.reduce((acc, member) => {
          acc[member.address] = !isAllSelected;
          return acc;
        }, {}),
      );
    },
    [expiredMembers],
  );

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

  const desktopColumnsDef = [
    rankColumn,
    memberColumn,
    operationDesktopColumnFunc(selected, toggleSelection, toggleAllSelection),
  ];

  const mobileColumnsDef = [
    rankColumn,
    memberColumn,
    operationMobileColumnFunc(selected, toggleSelection),
  ];

  const allSelected = Object.values(selected).every((v) => v);

  return (
    <>
      <div className="hidden max-sm:flex flex-col items-end">
        <Checkbox
          checked={allSelected}
          onClick={() => toggleAllSelection(allSelected)}
          className="w-4 h-4 cursor-pointer"
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

const PopupContent = memo(Content);

export default function BatchBumpPopup(props) {
  const { expiredMembers = [], isLoading } = useDemotionExpiredMembers();

  return (
    <PopupWithSigner
      title={
        <span>
          Bump Members
          <span className="ml-1 text14Medium text-textTertiary">
            {expiredMembers?.length}
          </span>
        </span>
      }
      {...props}
    >
      <PopupContent expiredMembers={expiredMembers} isLoading={isLoading} />
    </PopupWithSigner>
  );
}
