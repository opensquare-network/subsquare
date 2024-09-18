import { isNil } from "lodash-es";
import { useMemo } from "react";
import useFellowshipCoreOnlySwitch from "./useFellowshipCoreOnlySwitch";
import useSubCoreCollectivesMember from "next-common/hooks/collectives/useSubCoreCollectivesMember";
import usePeriodSelect, {
  DemotionPeriodAboutToExpire,
  DemotionPeriodExpired,
  Promotable,
} from "next-common/components/pages/fellowship/usePeriodSelect";
import usePeriodFilterFn from "next-common/components/pages/fellowship/usePeriodFilterFn";
import { useRouterRankFilter } from "next-common/hooks/fellowship/useRankFilter";

function getMemberStatus(item) {
  const { member, isLoading } = useSubCoreCollectivesMember(item.address);
  return {
    status: member,
    isLoading,
  };
}

function handleFilterMembers(members) {
  return members.map((item) => {
    const { status, isLoading } = getMemberStatus(item);
    return {
      ...item,
      status,
      isFellowshipOnly: !isNil(status) && !isLoading,
    };
  });
}

export default function useFellowshipCoreMembersFilter(members) {
  const { isOn: isFellowshipCoreOnly, component: FellowshipCoreSwitch } =
    useFellowshipCoreOnlySwitch();
  const membersWithStatus = handleFilterMembers(members);

  const { periodFilter, component: PeriodFilterComponent } = usePeriodSelect();

  const ranks = [...new Set(membersWithStatus.map((m) => m.rank))];
  const { rank, component: RankFilterComponent } = useRouterRankFilter(ranks);
  // TODO: need params
  // const {
  //   filterDemotionAboutToExpireFn,
  //   filterDemotionExpiredFn,
  //   filterPromotableFn,
  // } = usePeriodFilterFn();

  const filteredMembers = useMemo(() => {
    if (isNil(membersWithStatus)) return;

    let filteredMembers = membersWithStatus;

    // if (periodFilter === DemotionPeriodAboutToExpire) {
    //   filteredMembers = filterDemotionAboutToExpireFn(filteredMembers);
    // } else if (periodFilter === DemotionPeriodExpired) {
    //   filteredMembers = filterDemotionExpiredFn(filteredMembers);
    // } else if (periodFilter === Promotable) {
    //   filteredMembers = filterPromotableFn(filteredMembers);
    // }

    if (isFellowshipCoreOnly) {
      filteredMembers = filteredMembers.filter((member) => {
        return member.isFellowshipOnly;
      });
    }

    if (isNil(rank)) {
      return filteredMembers;
    } else {
      return filteredMembers.filter((m) => m.rank === rank);
    }
  }, [membersWithStatus, isFellowshipCoreOnly]);

  console.log(":::::membersWithStatus", membersWithStatus);

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
