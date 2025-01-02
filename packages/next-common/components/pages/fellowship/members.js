import { isNil } from "lodash-es";
import FellowshipMemberTabs from "next-common/components/fellowship/core/members/tabs";
import { useMemo } from "react";
import { useRankFilterInDropdown } from "next-common/hooks/fellowship/useRankFilter";
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
import {
  DemotionPeriodAboutToExpire,
  DemotionPeriodExpired,
  Promotable,
  usePeriodSelectInDropdown,
} from "./usePeriodSelect";
import { useEvidenceOnlySwitchInDropdown } from "./useEvidenceOnlySwitch";
import useEvidenceOnlyFilterFn from "./useEvidenceOnlyFilterFn";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { useSelector } from "react-redux";
import useLatestHeightSnapshot from "next-common/components/fellowship/collective/hook/useLatestHeightSnapshot";
import {
  filterDemotionAboutToExpireFn,
  filterDemotionExpiredFn,
  filterPromotableFn,
} from "next-common/components/pages/fellowship/periodFilters";
import { DropdownFilter } from "next-common/components/dropdownFilter";
import { DropdownUrlFilterProvider } from "next-common/components/dropdownFilter/context";

function useMembersFilter(members) {
  const ranks = [...new Set(members.map((m) => m.rank))];

  const { rank, component: rankFilterComponent } =
    useRankFilterInDropdown(ranks);
  const { periodFilter, component: periodFilterComponent } =
    usePeriodSelectInDropdown();
  const { isOn: isEvidenceOnly, component: evidenceOnlySwitch } =
    useEvidenceOnlySwitchInDropdown();

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
    <DropdownFilter className="w-[320px]">
      {evidenceOnlySwitch}
      {periodFilterComponent}
      {rankFilterComponent}
    </DropdownFilter>
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

  return (
    <FellowshipMembersLoadable>
      <FellowshipMemberCommon>
        <div className="flex flex-wrap max-md:flex-col md:items-center gap-[12px] max-md:gap-[16px] justify-between mb-4 pr-6">
          <FellowshipMemberTabs
            membersCount={membersCount}
            candidatesCount={candidatesCount}
          />
          {memberFilters}
        </div>

        <MemberWarnings className="mb-[24px]" />

        {hasMembers ? (
          <FellowshipCoreMemberCardListContainer>
            {filteredMembers.map((member) => (
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
          <DropdownUrlFilterProvider
            defaultFilterValues={{
              evidence_only: false,
              period: "all",
              rank: null,
            }}
          >
            <FellowshipMembersPageInContext />
          </DropdownUrlFilterProvider>
        </CoreMembersWithRankProvider>
      </AllMemberEvidenceProvider>
    </CollectivesProvider>
  );
}
