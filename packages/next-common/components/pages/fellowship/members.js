import FellowshipMemberTabs from "next-common/components/fellowship/core/members/tabs";
import { useMemo, useState } from "react";
import FellowshipMemberCommon from "next-common/components/pages/fellowship/common";
import FellowshipMembersEmpty from "./empty";
import { usePageProps } from "next-common/context/page";
import CollectivesProvider, {
  useCollectivesContext,
} from "next-common/context/collectives/collectives";
import MemberWarnings from "next-common/components/fellowship/core/memberWarnings";
import { CoreMembersWithRankProvider } from "next-common/components/collectives/core/context/coreMembersWithRankContext";
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

function FellowshipMembers({ viewMode, members, isLoading }) {
  if (viewMode === "list") {
    return <FellowshipMemberListView members={members} isLoading={isLoading} />;
  }

  return <FellowshipMemberCardView members={members} isLoading={isLoading} />;
}

function useViewModeSwitch() {
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

function FellowshipMembersPageInContext() {
  const router = useRouter();
  const { fellowshipMembers } = usePageProps();
  const { membersWithStatus, isLoading } =
    useMembersWithStatus(fellowshipMembers);

  const { viewMode, component: viewModeSwitch } = useViewModeSwitch();
  const regularMembers = useMemo(
    () => (membersWithStatus || []).filter((member) => member.rank > 0),
    [membersWithStatus],
  );
  const { filteredMembers, component: memberFilters } =
    useMembersFilter(regularMembers);

  const candidates = useMemo(
    () =>
      (membersWithStatus || []).filter(
        (member) => member.rank <= 0 && member.isFellowshipCoreMember,
      ),
    [membersWithStatus],
  );

  const membersCount = filteredMembers?.length;
  const candidatesCount = candidates?.length;

  const isCandidatesPage =
    router.asPath === "/fellowship/members?candidates=true";

  return (
    <FellowshipMemberCommon>
      <div className="flex flex-wrap max-md:flex-col md:items-center gap-[16px] max-md:gap-[12px] justify-between mb-4 pr-6 h-[28px]">
        <FellowshipMemberTabs
          membersCount={membersCount}
          candidatesCount={candidatesCount}
        />
        {!isCandidatesPage && (
          <div className="flex items-center gap-[12px] max-sm:pl-6">
            {memberFilters}
            {viewModeSwitch}
          </div>
        )}
      </div>

      {!isCandidatesPage && <MemberWarnings className="mb-[24px]" />}

      {isCandidatesPage ? (
        <FellowshipCandidatesCardList
          candidates={candidates}
          isLoading={isLoading}
        />
      ) : (
        <FellowshipMembersCardList
          viewMode={viewMode}
          isLoading={isLoading}
          members={filteredMembers}
        />
      )}
    </FellowshipMemberCommon>
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
              fellowship_core_only: true,
            }}
            emptyFilterValues={{
              evidence_only: false,
              period: "all",
              rank: null,
              fellowship_core_only: false,
            }}
          >
            <FellowshipMembersPageInContext />
          </DropdownUrlFilterProvider>
        </CoreMembersWithRankProvider>
      </AllMemberEvidenceProvider>
    </CollectivesProvider>
  );
}
