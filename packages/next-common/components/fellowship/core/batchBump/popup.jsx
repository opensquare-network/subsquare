import PopupWithSigner from "next-common/components/popupWithSigner";
import { useCallback, useMemo, useState } from "react";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { useContextApi } from "next-common/context/api";
import { useCoreFellowshipPallet } from "next-common/context/collectives/collectives";
import useCoreFellowshipUpdateFunc from "next-common/components/collectives/core/updateFunc";
import { MapDataList } from "next-common/components/dataList";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import { useCoreMembersWithRankContext } from "next-common/components/collectives/core/context/coreMembersWithRankContext";
import { partition } from "lodash-es";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { useSelector } from "react-redux";
import { useCoreFellowshipParams } from "next-common/context/collectives/collectives";
import { isDemotionExpired } from "next-common/utils/collective/demotionAndPromotion";
import { StatisticsTitle } from "next-common/components/statistics/styled";
import useBatchBumpColumns from "./useBatchBumpColumns";

function useDemotionExpiredMembers() {
  const { coreMembers, isLoading } = useCoreMembersWithRankContext();

  const [members] = useMemo(
    () => partition(coreMembers, (m) => m.rank > 0),
    [coreMembers],
  );

  const latestHeight = useSelector(chainOrScanHeightSelector);
  const params = useCoreFellowshipParams();

  const expiredMembers = useMemo(() => {
    return (members || []).filter((coreMember) => {
      const {
        status: { lastProof },
        rank,
      } = coreMember;

      return isDemotionExpired({ lastProof, rank, params, latestHeight });
    });
  }, [members, latestHeight, params]);

  return {
    expiredMembers,
    isLoading,
  };
}

function Content() {
  const api = useContextApi();
  const pallet = useCoreFellowshipPallet();
  const { expiredMembers = [], isLoading } = useDemotionExpiredMembers();
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

  const columnsDef = useBatchBumpColumns(selected, toggleSelection);

  return (
    <>
      <div className="inline-flex space-x-1">
        <StatisticsTitle className="mb-0">Bumpable</StatisticsTitle>
        <span className="text14Medium text-textTertiary">
          {expiredMembers?.length}
        </span>
      </div>
      <div className="max-h-[450px] overflow-auto">
        <ScrollerX>
          <MapDataList
            columnsDef={columnsDef}
            data={expiredMembers}
            loading={isLoading}
            noDataText="No members can be demoted."
            className="max-h-[450px] overflow-auto"
          />
        </ScrollerX>
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

export default function BatchBumpPopup(props) {
  return (
    <PopupWithSigner title="Bump Members" {...props}>
      <Content />
    </PopupWithSigner>
  );
}
