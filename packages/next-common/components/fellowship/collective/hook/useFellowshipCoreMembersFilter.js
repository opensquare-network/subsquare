import { isNil } from "lodash-es";
import { useMemo } from "react";
import useFellowshipCoreOnlySwitch from "./useFellowshipCoreOnlySwitch";
import useSubCoreCollectivesMember from "next-common/hooks/collectives/useSubCoreCollectivesMember";
import usePeriodSelect, {
  DemotionPeriodAboutToExpire,
  DemotionPeriodExpired,
  Promotable,
} from "next-common/components/pages/fellowship/usePeriodSelect";
import { useRouterRankFilter } from "next-common/hooks/fellowship/useRankFilter";
import { useCoreFellowshipParams } from "next-common/context/collectives/collectives";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { useSelector } from "react-redux";
import useLatestHeightSnapshot from "./useLatestHeightSnapshot";
import {
  filterDemotionAboutToExpireFn,
  filterDemotionExpiredFn,
  filterPromotableFn,
} from "next-common/components/pages/fellowship/periodFilters";

function useSingleMemberStatus(item) {
  const { member, isLoading } = useSubCoreCollectivesMember(
    item.address,
    "fellowshipCore",
  );

  return {
    status: member,
    isLoading,
  };
}

export function handleFilterMembers(members) {
  const membersWithStatus = members.map((item) => {
    const { status, isLoading } = useSingleMemberStatus(item);
    return {
      ...item,
      status,
      isLoading,
      isFellowshipOnly: !isNil(status) && !isLoading,
    };
  });
  const isAllLoaded = membersWithStatus.every((item) => !item?.isLoading);

  return {
    members: membersWithStatus,
    isAllLoaded: isAllLoaded,
  };
}

export default function useFellowshipCoreMembersFilter(membersWithStatus) {
  const { isOn: isFellowshipCoreOnly, component: FellowshipCoreSwitch } =
    useFellowshipCoreOnlySwitch();

  const { periodFilter, component: PeriodFilterComponent } = usePeriodSelect();

  const ranks = [...new Set(membersWithStatus.map((m) => m.rank))];
  const { rank, component: RankFilterComponent } = useRouterRankFilter(ranks);
  const params = useCoreFellowshipParams();
  const blockTime = useSelector(blockTimeSelector);

  const { latestHeight, isLoading } = useLatestHeightSnapshot();

  const filteredMembers = useMemo(() => {
    if (isNil(membersWithStatus) || isLoading) return;

    let filteredMembers = membersWithStatus;

    if (periodFilter === DemotionPeriodAboutToExpire) {
      filteredMembers = filterDemotionAboutToExpireFn(
        filteredMembers,
        params,
        blockTime,
        latestHeight,
      );
    } else if (periodFilter === DemotionPeriodExpired) {
      filteredMembers = filterDemotionExpiredFn(
        filteredMembers,
        params,
        latestHeight,
      );
    } else if (periodFilter === Promotable) {
      filteredMembers = filterPromotableFn(
        filteredMembers,
        params,
        latestHeight,
      );
    }

    if (isFellowshipCoreOnly) {
      filteredMembers = filteredMembers.filter(
        (member) => member.isFellowshipOnly,
      );
    }

    if (isNil(rank)) {
      return filteredMembers;
    }
    return filteredMembers.filter((m) => m.rank === rank);
  }, [
    membersWithStatus,
    isFellowshipCoreOnly,
    periodFilter,
    rank,
    latestHeight,
    isLoading,
    filterDemotionAboutToExpireFn,
    filterDemotionExpiredFn,
    filterPromotableFn,
  ]);

  const component = (
    <div className="flex flex-wrap max-sm:flex-col sm:items-center gap-[12px] max-sm:gap-[8px] ml-[24px]">
      {FellowshipCoreSwitch}
      {PeriodFilterComponent}
      {RankFilterComponent}
    </div>
  );

  return {
    filteredMembers,
    component,
  };
}
