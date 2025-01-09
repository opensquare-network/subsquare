import PopupWithSigner from "next-common/components/popupWithSigner";
import { useCallback, useMemo } from "react";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
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
import { operationColumn, rankColumn, memberColumn } from "./columns";
import { StatisticsTitle } from "next-common/components/statistics/styled";

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
  const { who } = usePopupParams();
  const api = useContextApi();
  const pallet = useCoreFellowshipPallet();
  const { expiredMembers = [], isLoading } = useDemotionExpiredMembers();

  // TODO
  const getTxFunc = useCallback(() => {
    if (api && who) {
      return api.tx[pallet].bump(who);
    }
  }, [api, pallet, who]);

  const onInBlock = useCoreFellowshipUpdateFunc();
  const columnsDef = [operationColumn, rankColumn, memberColumn];

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
