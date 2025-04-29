import FellowshipMemberTabs from "next-common/components/fellowship/core/members/tabs";
import { useMemo, useState } from "react";
import { usePageProps } from "next-common/context/page";
import CollectivesProvider, {
  useCollectivesContext,
} from "next-common/context/collectives/collectives";
import { AllMemberEvidenceProvider } from "next-common/components/collectives/core/context/evidenceMemberContext";
import { DropdownUrlFilterProvider } from "next-common/components/dropdownFilter/context";
import useMembersWithMeAtFirst from "../useMembersWithMeAtFirst";
import FellowshipMemberListView from "../fellowship/memberListView";
import { useMembersWithStatusFromContext } from "next-common/components/fellowship/collective/hook/useFellowshipCoreMembersFilter";
import { useRouter } from "next/router";
import FellowshipCoreMemberCardListContainer from "next-common/components/fellowship/core/members/listContainer";
import { SystemLoading } from "@osn/icons/subsquare";
import FellowshipMembersEmpty from "../fellowship/empty";
import { useViewModeSwitch } from "../fellowship/members";
import useMembersFilter from "./useMembersFilter";
import AmbassadorCoreMemberCard from "next-common/components/ambassador/core/members/card";
import AmbassadorMemberCommon from "./common";
import { useCoreFellowshipParams } from "next-common/context/collectives/collectives";
import { useEffect } from "react";
import MoreActions from "./moreActions";

function AmbassadorMemberCardView({
  members: _members,
  isLoading: _isLoading,
}) {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMembers(_members);
    setIsLoading(_isLoading);
  }, [_members, _isLoading]);

  const params = useCoreFellowshipParams();

  if (isLoading) {
    return (
      <SystemLoading className="my-6 [&_path]:stroke-textTertiary mx-auto" />
    );
  }

  return (
    <FellowshipCoreMemberCardListContainer>
      {members.map((member) => (
        <AmbassadorCoreMemberCard
          key={member.address}
          member={member}
          params={params}
        />
      ))}
    </FellowshipCoreMemberCardListContainer>
  );
}

function AmbassadorMembersByViewMode({ viewMode, members, isLoading }) {
  if (viewMode === "list") {
    return (
      <FellowshipMemberListView
        members={members}
        isLoading={isLoading}
        ActionsComponent={MoreActions}
      />
    );
  }

  return <AmbassadorMemberCardView members={members} isLoading={isLoading} />;
}

function AmbassadorCandidatesCardList({ candidates, isLoading }) {
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
        <AmbassadorCoreMemberCard
          key={member.address}
          member={member}
          params={params}
          isCandidate={true}
        />
      ))}
    </FellowshipCoreMemberCardListContainer>
  );
}

function AmbassadorMembersList({ viewMode, isLoading, members }) {
  const hasMembers = members?.length > 0;
  const sortedMembers = useMembersWithMeAtFirst(members);

  if (!isLoading && !hasMembers) {
    return <FellowshipMembersEmpty />;
  }

  return (
    <AmbassadorMembersByViewMode
      viewMode={viewMode}
      members={sortedMembers}
      isLoading={isLoading}
    />
  );
}

function AmbassadorMembersTabPage({
  members,
  candidates,
  memberFilters,
  isLoading,
}) {
  const { viewMode, component: viewModeSwitch } = useViewModeSwitch();

  const membersCount = members?.length;
  const candidatesCount = candidates?.length;

  return (
    <AmbassadorMemberCommon>
      <div className="flex flex-wrap max-md:flex-col md:items-center gap-[16px] max-md:gap-[12px] justify-between mb-4 pr-6">
        <FellowshipMemberTabs
          membersCount={membersCount}
          candidatesCount={candidatesCount}
          section="ambassador"
        />
        <div className="flex items-center gap-[12px] max-md:pl-6">
          {memberFilters}
          {viewModeSwitch}
        </div>
      </div>

      <AmbassadorMembersList
        viewMode={viewMode}
        isLoading={isLoading}
        members={members}
      />
    </AmbassadorMemberCommon>
  );
}

function AmbassadorCandidatesTabPage({ members, candidates, isLoading }) {
  const membersCount = members?.length;
  const candidatesCount = candidates?.length;

  return (
    <AmbassadorMemberCommon>
      <div className="flex flex-wrap max-md:flex-col md:items-center gap-[16px] max-md:gap-[12px] justify-between mb-4 pr-6 h-[28px]">
        <FellowshipMemberTabs
          membersCount={membersCount}
          candidatesCount={candidatesCount}
          section="ambassador"
        />
      </div>
      <AmbassadorCandidatesCardList
        candidates={candidates}
        isLoading={isLoading}
      />
    </AmbassadorMemberCommon>
  );
}

function AmbassadorMembersPageInContext() {
  const router = useRouter();
  const { ambassadorMembers } = usePageProps();
  const { membersWithStatus, isLoading } =
    useMembersWithStatusFromContext(ambassadorMembers);
  const regularMembers = useMemo(
    () => (membersWithStatus || []).filter((member) => member.rank > 0),
    [membersWithStatus],
  );
  const { filteredMembers: members, component: memberFilters } =
    useMembersFilter(regularMembers);

  const candidates = useMemo(
    () =>
      (membersWithStatus || []).filter(
        (member) => member.rank <= 0 && member.isFellowshipCoreMember,
      ),
    [membersWithStatus],
  );

  const isCandidatesPage =
    router.asPath === "/ambassador/members?tab=candidates";

  if (isCandidatesPage) {
    return (
      <AmbassadorCandidatesTabPage
        members={members}
        candidates={candidates}
        isLoading={isLoading}
      />
    );
  }

  return (
    <AmbassadorMembersTabPage
      members={members}
      candidates={candidates}
      memberFilters={memberFilters}
      isLoading={isLoading}
    />
  );
}

export default function AmbassadorMembersPage() {
  const { ambassadorParams } = usePageProps();

  return (
    <CollectivesProvider params={ambassadorParams} section="ambassador">
      <AllMemberEvidenceProvider>
        <DropdownUrlFilterProvider
          defaultFilterValues={{
            rank: null,
            core_only: true,
          }}
          emptyFilterValues={{
            rank: null,
            core_only: false,
          }}
        >
          <AmbassadorMembersPageInContext />
        </DropdownUrlFilterProvider>
      </AllMemberEvidenceProvider>
    </CollectivesProvider>
  );
}
