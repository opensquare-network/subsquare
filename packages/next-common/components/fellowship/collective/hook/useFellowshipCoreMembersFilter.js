import { isNil } from "lodash-es";
import { useMemo, useRef } from "react";
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
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import {
  isDemotionAboutToExpire,
  isDemotionExpired,
  isPromotable,
} from "next-common/utils/collective/demotionAndPromotion";
import { useSelector } from "react-redux";
import useLatestHeightSnapshot from "./useLatestHeightSnapshot";

function filterDemotionAboutToExpireFn(
  members,
  params,
  blockTime,
  latestHeight,
) {
  return members.filter((member) => {
    if (isNil(member?.status)) return false;

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
}

function filterDemotionExpiredFn(members, params, latestHeight) {
  return members.filter((member) => {
    if (isNil(member?.status)) return false;

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
}

function filterPromotableFn(members, params, latestHeight) {
  return members.filter((member) => {
    if (isNil(member?.status)) return false;

    const {
      rank,
      status: { lastProof },
    } = member;

    return isPromotable({
      lastProof,
      rank,
      latestHeight,
      params,
    });
  });
}

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
  // const latestHeight = useSelector(chainOrScanHeightSelector);

  const { latestHeight, isLoading } = useLatestHeightSnapshot();

  const initialLatestHeightRef = useRef(latestHeight);

  const filteredMembers = useMemo(() => {
    if (isNil(membersWithStatus) || isLoading) return;

    let filteredMembers = membersWithStatus;

    const constantHeight = initialLatestHeightRef.current;

    if (periodFilter === DemotionPeriodAboutToExpire) {
      filteredMembers = filterDemotionAboutToExpireFn(
        filteredMembers,
        params,
        blockTime,
        constantHeight,
      );
    } else if (periodFilter === DemotionPeriodExpired) {
      filteredMembers = filterDemotionExpiredFn(
        filteredMembers,
        params,
        constantHeight,
      );
    } else if (periodFilter === Promotable) {
      filteredMembers = filterPromotableFn(
        filteredMembers,
        params,
        constantHeight,
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
    filterDemotionExpiredFn,
    filterDemotionExpiredFn,
    filterDemotionAboutToExpireFn,
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
