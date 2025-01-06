import FellowshipMemberTabs from "next-common/components/fellowship/core/members/tabs";
import { useMemo, useState } from "react";
import FellowshipMembersLoadable from "next-common/components/pages/fellowship/loadable";
import FellowshipMemberCommon from "next-common/components/pages/fellowship/common";
import FellowshipMembersEmpty from "./empty";
import { usePageProps } from "next-common/context/page";
import CollectivesProvider from "next-common/context/collectives/collectives";
import MemberWarnings from "next-common/components/fellowship/core/memberWarnings";
import { CoreMembersWithRankProvider } from "next-common/components/collectives/core/context/coreMembersWithRankContext";
import { AllMemberEvidenceProvider } from "next-common/components/collectives/core/context/evidenceMemberContext";
import { DropdownUrlFilterProvider } from "next-common/components/dropdownFilter/context";
import useMembersWithMeAtFirst from "../useMembersWithMeAtFirst";
import ViewModeSwitch from "./viewModeSwitch";
import useMembersFilter from "./useMemberFilter";
import FellowshipMemberCardView from "./memberCardView";
import FellowshipMemberListView from "./memberListView";
import { handleFilterMembers } from "next-common/components/fellowship/collective/hook/useFellowshipCoreMembersFilter";

function FellowshipMembers({ viewMode, members }) {
  if (viewMode === "list") {
    return <FellowshipMemberListView members={members} />;
  }

  return <FellowshipMemberCardView members={members} />;
}

function useViewModeSwitch() {
  const [viewMode, setViewMode] = useState("list");
  return {
    viewMode,
    component: <ViewModeSwitch viewMode={viewMode} setViewMode={setViewMode} />,
  };
}

function FellowshipMembersPageInContext() {
  const { fellowshipMembers } = usePageProps();
  const { members: membersWithStatus } = handleFilterMembers(fellowshipMembers);

  const { viewMode, component: viewModeSwitch } = useViewModeSwitch();
  const pageMembers = useMemo(
    () => (membersWithStatus || []).filter((member) => member.rank > 0),
    [membersWithStatus],
  );

  const { filteredMembers, component: memberFilters } =
    useMembersFilter(pageMembers);
  const hasMembers = filteredMembers?.length > 0;

  const membersCount = filteredMembers?.length;
  const candidatesCount = useMemo(
    () => (membersWithStatus || []).filter((member) => member.rank <= 0).length,
    [membersWithStatus],
  );

  const sortedFilteredMembers = useMembersWithMeAtFirst(filteredMembers);

  return (
    <FellowshipMembersLoadable>
      <FellowshipMemberCommon>
        <div className="flex flex-wrap max-md:flex-col md:items-center gap-[16px] max-md:gap-[12px] justify-between mb-4 pr-6">
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

        {hasMembers ? (
          <FellowshipMembers
            viewMode={viewMode}
            members={sortedFilteredMembers}
          />
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
