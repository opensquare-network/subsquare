import { isNil } from "lodash-es";
import FellowshipMemberTabs from "next-common/components/fellowship/core/members/tabs";
import { useMemo } from "react";
import { useRouterRankFilter } from "next-common/hooks/fellowship/useRankFilter";
import FellowshipMembersLoadable from "next-common/components/pages/fellowship/loadable";
import FellowshipMemberCommon from "next-common/components/pages/fellowship/common";
import FellowshipCoreMemberCardListContainer from "next-common/components/fellowship/core/members/listContainer";
import FellowshipCoreMemberCard from "next-common/components/fellowship/core/members/card";
import FellowshipMembersEmpty from "./empty";
import useFellowshipSortedCoreMembers from "next-common/hooks/fellowship/core/useFellowshipSortedCoreMembers";
import { usePageProps } from "next-common/context/page";
import CollectivesProvider, {
  useCoreFellowshipParams,
} from "next-common/context/collectives/collectives";
import MemberWarnings from "next-common/components/fellowship/core/memberWarnings";
import { CoreMembersWithRankProvider } from "next-common/components/collectives/core/context/coreMembersWithRankContext";
import { AllMemberEvidenceProvider } from "next-common/components/collectives/core/context/evidenceMemberContext";
import usePeriodSelect, {
  DemotionPeriodAboutToExpire,
  DemotionPeriodExpired,
  Promotable,
} from "./usePeriodSelect";
import useEvidenceOnlySwitch from "./useEvidenceOnlySwitch";
import useEvidenceOnlyFilterFn from "./useEvidenceOnlyFilterFn";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { useSelector } from "react-redux";
import useLatestHeightSnapshot from "next-common/components/fellowship/collective/hook/useLatestHeightSnapshot";
import {
  filterDemotionAboutToExpireFn,
  filterDemotionExpiredFn,
  filterPromotableFn,
} from "next-common/components/pages/fellowship/periodFilters";
import useMembersWithMeAtFirst from "../useMembersWithMeAtFirst";

function useMembersFilter(members) {
  const ranks = [...new Set(members.map((m) => m.rank))];
  const { rank, component: rankFilterComponent } = useRouterRankFilter(ranks);

  const { periodFilter, component: periodFilterComponent } = usePeriodSelect();
  const { isOn: isEvidenceOnly, component: evidenceOnlySwitch } =
    useEvidenceOnlySwitch();
  const evidenceOnlyFilterFn = useEvidenceOnlyFilterFn();
  const params = useCoreFellowshipParams();
  const blockTime = useSelector(blockTimeSelector);

  const { latestHeight, isLoading } = useLatestHeightSnapshot();

  const filteredMembers = useMemo(() => {
    if (isLoading) {
      return;
    }

    let filteredMembers = members;

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

    if (isEvidenceOnly) {
      filteredMembers = evidenceOnlyFilterFn(filteredMembers);
    }

    if (isNil(rank)) {
      return filteredMembers;
    } else {
      return filteredMembers.filter((m) => m.rank === rank);
    }
  }, [
    members,
    periodFilter,
    isEvidenceOnly,
    evidenceOnlyFilterFn,
    rank,
    isLoading,
    latestHeight,
    blockTime,
    params,
  ]);

  const component = (
    <div className="flex flex-wrap max-sm:flex-col sm:items-center gap-[12px] max-sm:gap-[8px] ml-[24px]">
      {evidenceOnlySwitch}
      {periodFilterComponent}
      {rankFilterComponent}
    </div>
  );

  return {
    filteredMembers,
    component,
  };
}

function FellowshipMembersPageInContext() {
  const members = useFellowshipSortedCoreMembers();
  const pageMembers = useMemo(
    () => (members || []).filter((member) => member.rank > 0),
    [members],
  );
  const params = useCoreFellowshipParams();
  const { filteredMembers, component: memberFilters } =
    useMembersFilter(pageMembers);
  const hasMembers = filteredMembers?.length > 0;

  const membersCount = filteredMembers?.length;
  const candidatesCount = useMemo(
    () => (members || []).filter((member) => member.rank <= 0).length,
    [members],
  );

  const sortedFilteredMembers = useMembersWithMeAtFirst(filteredMembers);

  return (
    <FellowshipMembersLoadable>
      <FellowshipMemberCommon>
        <MemberWarnings className="mb-[24px]" />

        <div className="flex flex-wrap max-md:flex-col md:items-center gap-[12px] max-md:gap-[16px] justify-between mb-4 pr-6">
          <FellowshipMemberTabs
            membersCount={membersCount}
            candidatesCount={candidatesCount}
          />
          {memberFilters}
        </div>

        {hasMembers ? (
          <FellowshipCoreMemberCardListContainer>
            {sortedFilteredMembers.map((member) => (
              <FellowshipCoreMemberCard
                key={member.address}
                member={member}
                params={params}
              />
            ))}
          </FellowshipCoreMemberCardListContainer>
        ) : (
          <FellowshipMembersEmpty />
        )}
      </FellowshipMemberCommon>
    </FellowshipMembersLoadable>
  );
}

export default function FellowshipMembersPage() {
  const { fellowshipParams } = usePageProps();

  return (
    <CollectivesProvider params={fellowshipParams} section="fellowship">
      <AllMemberEvidenceProvider>
        <CoreMembersWithRankProvider>
          <FellowshipMembersPageInContext />
        </CoreMembersWithRankProvider>
      </AllMemberEvidenceProvider>
    </CollectivesProvider>
  );
}
