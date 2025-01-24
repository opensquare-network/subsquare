import { useMemo } from "react";
import { useSelector } from "react-redux";
import { partition } from "lodash-es";
import useFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFellowshipCoreMembers";
import { getDemotionExpiredCount } from "next-common/components/fellowship/core/memberWarnings";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import useCoreFellowshipParams from "next-common/hooks/fellowship/core/useFellowshipCoreMember";

export default function useDemotedBumpAllTodo() {
  const { members: coreMembers, loading: isLoading } =
    useFellowshipCoreMembers();
  const latestHeight = useSelector(chainOrScanHeightSelector);
  const { params, isLoading: isParamsLoading } = useCoreFellowshipParams();

  const [members] = useMemo(
    () => partition(coreMembers, (m) => m.rank > 0),
    [coreMembers],
  );

  if (isParamsLoading) {
    return { todo: { showDemotedBumpAllTodo: false }, isLoading: true };
  }

  const expiredMembersCount = getDemotionExpiredCount({
    members,
    latestHeight,
    params,
  });

  return {
    todo: {
      showDemotedBumpAllTodo: expiredMembersCount > 0,
    },
    expiredMembersCount,
    isLoading,
  };
}
