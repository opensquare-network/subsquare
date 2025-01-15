import FellowshipMemberTabs from "next-common/components/fellowship/core/members/tabs";
import { useMemo, useState } from "react";
import FellowshipMemberCommon from "next-common/components/pages/fellowship/common";
import FellowshipMembersEmpty from "./empty";
import { usePageProps } from "next-common/context/page";
import CollectivesProvider, {
  useCollectivesContext,
} from "next-common/context/collectives/collectives";
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
import FellowshipCoreMemberCardListContainer from "next-common/components/fellowship/core/members/listContainer";
import FellowshipCoreMemberCard from "next-common/components/fellowship/core/members/card";
import { SystemLoading } from "@osn/icons/subsquare";
import MoreActions from "./moreActions";

function FellowshipMembers({ viewMode, members, isLoading }) {
  if (viewMode === "list") {
    return (
      <FellowshipMemberListView
        members={members}
        isLoading={isLoading}
        ActionsComponent={MoreActions}
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

function FellowshipCandidatesCardList({ candidates, isLoading }) {
  const hasMembers = candidates?.length > 0;
  const { params } = useCollectivesContext();

  if (isLoading) {
    return (
      <SystemLoading className="my-6 [&_path]:stroke-textTertiary mx-auto" />
    );
  }

  if (!isLoading && !hasMembers) {
    return <FellowshipMembersEmpty />;
  }

  return (
    <FellowshipCoreMemberCardListContainer>
      {candidates.map((member) => (
        <FellowshipCoreMemberCard
          key={member.address}
          member={member}
          params={params}
          isCandidate={true}
        />
      ))}
    </FellowshipCoreMemberCardListContainer>
  );
}

function FellowshipMembersCardList({ viewMode, isLoading, members }) {
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
    />
  );
}

function FellowshipMembersTabPage({
  members,
  candidates,
  memberFilters,
  isLoading,
}) {
  const { viewMode, component: viewModeSwitch } = useViewModeSwitch();

  const membersCount = members?.length;
  const candidatesCount = candidates?.length;

  return (
    <FellowshipMemberCommon>
      <div className="flex flex-wrap max-md:flex-col md:items-center gap-[16px] max-md:gap-[12px] justify-between mb-4 pr-6 h-[28px]">
        <FellowshipMemberTabs
          membersCount={membersCount}
          candidatesCount={candidatesCount}
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

function FellowshipCandidatesTabPage({ members, candidates, isLoading }) {
  const membersCount = members?.length;
  const candidatesCount = candidates?.length;

  return (
    <FellowshipMemberCommon>
      <div className="flex flex-wrap max-md:flex-col md:items-center gap-[16px] max-md:gap-[12px] justify-between mb-4 pr-6 h-[28px]">
        <FellowshipMemberTabs
          membersCount={membersCount}
          candidatesCount={candidatesCount}
        />
      </div>
      <FellowshipCandidatesCardList
        candidates={candidates}
        isLoading={isLoading}
      />
    </FellowshipMemberCommon>
  );
}

function FellowshipMembersPageInContext() {
  const router = useRouter();
  const { fellowshipMembers } = usePageProps();
  const { membersWithStatus, isLoading } =
    useMembersWithStatus(fellowshipMembers);
  const regularMembers = useMemo(
    () => (membersWithStatus || []).filter((member) => member.rank > 0),
    [membersWithStatus],
  );
  const { filteredMembers: members, component: memberFilters } =
    useMembersFilter(regularMembers);

  const candidates = useMemo(() => {
    if (!membersWithStatus) {
      return null;
    }

    return (membersWithStatus || []).filter(
      (member) => member.rank <= 0 && member.isFellowshipCoreMember,
    );
  }, [membersWithStatus]);

  const isCandidatesPage =
    router.asPath === "/fellowship/members?tab=candidates";

  if (isCandidatesPage) {
    return (
      <FellowshipCandidatesTabPage
        members={members}
        candidates={candidates}
        isLoading={isLoading}
      />
    );
  }

  return (
    <FellowshipMembersTabPage
      members={members}
      candidates={candidates}
      memberFilters={memberFilters}
      isLoading={isLoading}
    />
  );
}

export default function FellowshipMembersPage() {
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
          <FellowshipMembersPageInContext />
        </DropdownUrlFilterProvider>
      </AllMemberEvidenceProvider>
    </CollectivesProvider>
  );
}
