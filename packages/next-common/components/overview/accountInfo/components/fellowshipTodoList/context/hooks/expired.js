import { MembersContext } from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/members";
import { useContext, useMemo } from "react";
import { CoreParamsContext } from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/coreParams";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { useSelector } from "react-redux";
import { isDemotionExpired } from "next-common/utils/collective/demotionAndPromotion";

export default function useDemotionExpiredMembers() {
  const { members = [] } = useContext(MembersContext);
  const { params } = useContext(CoreParamsContext);
  const latestHeight = useSelector(chainOrScanHeightSelector);

  return useMemo(() => {
    return members.filter((member) => {
      const {
        status: { lastProof },
        rank,
      } = member;

      return isDemotionExpired({
        lastProof,
        rank,
        params,
        latestHeight,
      });
    });
  }, [members, params, latestHeight]);
}
