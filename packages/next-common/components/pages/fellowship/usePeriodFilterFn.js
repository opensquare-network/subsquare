import { useCoreFellowshipParams } from "next-common/context/collectives/collectives";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import {
  isDemotionAboutToExpire,
  isDemotionExpired,
  isPromotable,
} from "next-common/utils/collective/demotionAndPromotion";
import { useCallback } from "react";
import { useSelector } from "react-redux";

export default function usePeriodFilterFn() {
  const params = useCoreFellowshipParams();
  const blockTime = useSelector(blockTimeSelector);
  const latestHeight = useSelector(chainOrScanHeightSelector);

  const filterDemotionAboutToExpireFn = useCallback(
    (members) => {
      return members.filter((member) => {
        const {
          rank,
          status: { lastProof },
        } = member;

        return isDemotionAboutToExpire({
          lastProof,
          rank,
          params,
          blockTime,
          latestHeight,
        });
      });
    },
    [params, blockTime, latestHeight],
  );

  const filterDemotionExpiredFn = useCallback(
    (members) => {
      return members.filter((member) => {
        const {
          rank,
          status: { lastProof },
        } = member;

        return isDemotionExpired({
          lastProof,
          rank,
          latestHeight,
          params,
        });
      });
    },
    [params, latestHeight],
  );

  const filterPromotableFn = useCallback(
    (members) => {
      return members.filter((member) => {
        const {
          rank,
          status: { lastPromotion },
        } = member;

        return isPromotable({
          lastPromotion,
          rank,
          latestHeight,
          params,
        });
      });
    },
    [params, latestHeight],
  );

  return {
    filterDemotionAboutToExpireFn,
    filterDemotionExpiredFn,
    filterPromotableFn,
  };
}
