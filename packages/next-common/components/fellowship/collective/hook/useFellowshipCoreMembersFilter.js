import { isNil, filter, partition } from "lodash-es";
import { useEffect, useMemo, useState } from "react";
import useFellowshipCoreOnlySwitch from "./useFellowshipCoreOnlySwitch";
import useSubCoreCollectivesMember from "next-common/hooks/collectives/useSubCoreCollectivesMember";
import usePeriodSelect, {
  DemotionPeriodAboutToExpire,
  DemotionPeriodExpired,
  Promotable,
} from "next-common/components/pages/fellowship/usePeriodSelect";
import { useRouterRankFilter } from "next-common/hooks/fellowship/useRankFilter";
import {
  useCoreFellowshipPallet,
  useCoreFellowshipParams,
} from "next-common/context/collectives/collectives";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { useSelector } from "react-redux";
import useLatestHeightSnapshot from "./useLatestHeightSnapshot";
import {
  filterDemotionAboutToExpireFn,
  filterDemotionExpiredFn,
  filterPromotableFn,
} from "next-common/components/pages/fellowship/periodFilters";
import { useContextApi } from "next-common/context/api";
import nextApi from "next-common/services/nextApi";
import { fellowshipMembersApiUri } from "next-common/services/url";

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

export function useMembersWithStatus(members) {
  const api = useContextApi();
  const pallet = useCoreFellowshipPallet();
  const [membersWithStatus, setMembersWithStatus] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!api) {
      return;
    }

    if (!members || !members.length) {
      setMembersWithStatus([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    api.query[pallet].member
      .multi(members.map((m) => m.address))
      .then((result) => {
        const membersWithStatus = members.map((item, index) => {
          const status = result[index]?.toJSON();
          return {
            ...item,
            status,
            isFellowshipCoreMember: !isNil(status),
          };
        });
        setMembersWithStatus(membersWithStatus);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [api, members, pallet]);

  return {
    membersWithStatus,
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
      isFellowshipCoreMember: !isNil(status) && !isLoading,
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
        (member) => member.isFellowshipCoreMember,
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
    blockTime,
    params,
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

function useFellowshipCoreMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    nextApi
      .fetch(fellowshipMembersApiUri)
      .then((res) => {
        setMembers(res.result);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return {
    isLoading: loading,
    members,
  };
}

const pallet = "fellowshipCore";
function useFellowshipCoreWithStatus(members) {
  const api = useContextApi();
  const [membersWithStatus, setMembersWithStatus] = useState();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!api) {
      return;
    }

    if (!members || !members.length) {
      setMembersWithStatus([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    api.query[pallet].member
      .multi(members.map((m) => m.address))
      .then((result) => {
        const membersWithStatus = members.map((item, index) => {
          const status = result[index]?.toJSON();
          return {
            ...item,
            status,
            isFellowshipCoreMember: !isNil(status),
          };
        });
        setMembersWithStatus(membersWithStatus);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [api, members]);

  return {
    isLoading,
    membersWithStatus,
  };
}
export function useFellowshipCoreMembersCount() {
  const { members: memberList, isLoading: membersLoading } =
    useFellowshipCoreMembers();
  const { membersWithStatus, isLoading: memberStatusLoading } =
    useFellowshipCoreWithStatus(memberList);

  const [members, candidates] = partition(membersWithStatus, (m) => m.rank > 0);

  const coreMembersCount = filter(members, {
    isFellowshipCoreMember: true,
  }).length;
  const coreCandidatesCount = filter(candidates, {
    isFellowshipCoreMember: true,
  }).length;

  return {
    isLoading: membersLoading || memberStatusLoading,
    coreMembersCount,
    coreCandidatesCount,
    members: memberList,
    membersWithStatus,
  };
}
