import FellowshipMemberTabs from "next-common/components/fellowship/core/members/tabs";
import { useState } from "react";
import FellowshipMemberCommon from "next-common/components/pages/fellowship/common";
import FellowshipMembersEmpty from "./empty";
import { usePageProps } from "next-common/context/page";
import CollectivesProvider from "next-common/context/collectives/collectives";
import MemberWarnings from "next-common/components/fellowship/core/memberWarnings";
import { AllMemberEvidenceProvider } from "next-common/components/collectives/core/context/evidenceMemberContext";
import { DropdownUrlFilterProvider } from "next-common/components/dropdownFilter/context";
import useMembersWithMeAtFirst from "../useMembersWithMeAtFirst";
import ViewModeSwitch from "./viewModeSwitch";
import useMembersFilter from "./useMemberFilter";
import FellowshipMemberCardView from "./memberCardView";
import FellowshipMemberListView from "./memberListView";
import { useMembersWithStatus } from "next-common/components/fellowship/collective/hook/useFellowshipCoreMembersFilter";
import { useRouter } from "next/router";
import MoreActions from "./moreActions";
import { useChain } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";
import SimpleFellowshipMembersPage from "./simpleMembers";
import useCandidatesFilter from "./useCandidatesFilter";
import MemberCandidatesWarnings from "next-common/components/fellowship/core/memberWarnings/candidates";
import { filter, partition } from "lodash-es";

function FellowshipMembers({
  viewMode,
  members,
  isLoading,
  isCandidate = false,
}) {
  if (viewMode === "list") {
    return (
      <FellowshipMemberListView
        members={members}
        isLoading={isLoading}
        ActionsComponent={MoreActions}
        isCandidate={isCandidate}
      />
    );
  }

  return <FellowshipMemberCardView members={members} isLoading={isLoading} />;
}

export function useViewModeSwitch() {
  const [viewMode, setViewMode] = useState("list");
  return {
    viewMode,
    component: <ViewModeSwitch viewMode={viewMode} setViewMode={setViewMode} />,
  };
}

function FellowshipMembersCardList({
  viewMode,
  isLoading,
  members,
  isCandidate,
}) {
  const hasMembers = members?.length > 0;
  const sortedMembers = useMembersWithMeAtFirst(members);

  if (!isLoading && !hasMembers) {
    return <FellowshipMembersEmpty />;
  }

  return (
    <FellowshipMembers
      viewMode={viewMode}
      members={sortedMembers}
      isLoading={isLoading}
      isCandidate={isCandidate}
    />
  );
}

function FellowshipMembersTabPage({
  members,
  memberFilters,
  isLoading,
  coreMembersCount,
  coreCandidatesCount,
}) {
  const { viewMode, component: viewModeSwitch } = useViewModeSwitch();

  return (
    <FellowshipMemberCommon>
      <div className="flex flex-wrap max-md:flex-col md:items-center gap-[16px] max-md:gap-[12px] justify-between mb-4 pr-6 h-[28px]">
        <FellowshipMemberTabs
          membersCount={members?.length ?? coreMembersCount}
          candidatesCount={coreCandidatesCount}
        />
        <div className="flex items-center gap-[12px] max-sm:pl-6">
          {memberFilters}
          {viewModeSwitch}
        </div>
      </div>

      <MemberWarnings className="mb-[24px]" />

      <FellowshipMembersCardList
        viewMode={viewMode}
        isLoading={isLoading}
        members={members}
      />
    </FellowshipMemberCommon>
  );
}

function FellowshipCandidatesTabPage({
  candidates,
  isLoading,
  memberFilters,
  coreMembersCount,
  coreCandidatesCount,
}) {
  const { viewMode, component: viewModeSwitch } = useViewModeSwitch();

  return (
    <FellowshipMemberCommon>
      <div className="flex flex-wrap max-md:flex-col md:items-center gap-[16px] max-md:gap-[12px] justify-between mb-4 pr-6 h-[28px]">
        <FellowshipMemberTabs
          membersCount={coreMembersCount}
          candidatesCount={candidates?.length ?? coreCandidatesCount}
        />
        <div className="flex items-center gap-[12px] max-sm:pl-6">
          {memberFilters}
          {viewModeSwitch}
        </div>
      </div>

      <MemberCandidatesWarnings className="mb-6" members={candidates} />

      <FellowshipMembersCardList
        viewMode={viewMode}
        members={candidates}
        isLoading={isLoading}
        isCandidate
      />
    </FellowshipMemberCommon>
  );
}

function FellowshipMembersPageInContext({
  isLoading,
  members,
  coreMembersCount,
  coreCandidatesCount,
}) {
  const { filteredMembers, component: memberFilters } =
    useMembersFilter(members);

  return (
    <FellowshipMembersTabPage
      members={filteredMembers}
      memberFilters={memberFilters}
      isLoading={isLoading}
      coreMembersCount={coreMembersCount}
      coreCandidatesCount={coreCandidatesCount}
    />
  );
}

function FellowshipCandidatesPageInContext({
  isLoading,
  candidates,
  coreMembersCount,
  coreCandidatesCount,
}) {
  const { filteredMembers: filteredCandidates, component: candidateFilters } =
    useCandidatesFilter(candidates);

  return (
    <FellowshipCandidatesTabPage
      candidates={filteredCandidates}
      isLoading={isLoading}
      memberFilters={candidateFilters}
      coreMembersCount={coreMembersCount}
      coreCandidatesCount={coreCandidatesCount}
    />
  );
}

function FellowshipMembersInContext() {
  const { fellowshipMembers } = usePageProps();
  const { membersWithStatus, isLoading } =
    useMembersWithStatus(fellowshipMembers);

  const router = useRouter();
  const isCandidatesPage = router.query.tab === "candidates";

  const [members, candidates] = partition(membersWithStatus, (m) => m.rank > 0);
  const coreMembersCount = filter(members, {
    isFellowshipCoreMember: true,
  }).length;
  const coreCandidatesCount = filter(candidates, {
    isFellowshipCoreMember: true,
  }).length;

  return isCandidatesPage ? (
    <FellowshipCandidatesPageInContext
      isLoading={isLoading}
      candidates={candidates}
      coreMembersCount={coreMembersCount}
      coreCandidatesCount={coreCandidatesCount}
    />
  ) : (
    <FellowshipMembersPageInContext
      isLoading={isLoading}
      members={members}
      coreMembersCount={coreMembersCount}
      coreCandidatesCount={coreCandidatesCount}
    />
  );
}

function CollectivesFellowshipMembersPage() {
  const { fellowshipParams } = usePageProps();

  return (
    <CollectivesProvider params={fellowshipParams} section="fellowship">
      <AllMemberEvidenceProvider>
        <DropdownUrlFilterProvider
          defaultFilterValues={{
            evidence_only: false,
            period: "all",
            rank: null,
            core_only: true,
          }}
          emptyFilterValues={{
            evidence_only: false,
            period: "all",
            rank: null,
            core_only: false,
          }}
        >
          <FellowshipMembersInContext />
        </DropdownUrlFilterProvider>
      </AllMemberEvidenceProvider>
    </CollectivesProvider>
  );
}

export default function FellowshipMembersPage() {
  const chain = useChain();

  if (chain === Chains.collectives) {
    return <CollectivesFellowshipMembersPage />;
  }

  return <SimpleFellowshipMembersPage />;
}
