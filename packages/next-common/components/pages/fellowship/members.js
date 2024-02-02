import { useSelector } from "react-redux";
import { fellowshipCoreMembersSelector } from "next-common/store/reducers/fellowship/core";
import isNil from "lodash.isnil";
import FellowshipMemberTabs from "next-common/components/fellowship/core/members/tabs";
import { useMemo } from "react";
import useRankFilter from "next-common/hooks/fellowship/useRankFilter";
import FellowshipMembersLoadable from "next-common/components/pages/fellowship/loadable";
import FellowshipMemberCommon from "next-common/components/pages/fellowship/common";
import useFetchFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFetchFellowshipCoreMembers";
import FellowshipCoreMemberCardListContainer from "next-common/components/fellowship/core/members/listContainer";
import FellowshipCoreMemberCard from "next-common/components/fellowship/core/members/card";
import FellowshipMemberEmpty from "./empty";

export default function FellowshipMembersPage() {
  useFetchFellowshipCoreMembers();
  const members = useSelector(fellowshipCoreMembersSelector);
  const candidates = (members || []).filter((member) => member.rank <= 0);
  const pageMembers = useMemo(
    () => (members || []).filter((member) => member.rank > 0),
    [members],
  );
  const hasMembers = !!pageMembers.length;

  const ranks = [...new Set(pageMembers.map((m) => m.rank))];
  const { rank, component } = useRankFilter(ranks);

  const filteredMembers = useMemo(() => {
    if (isNil(rank)) {
      return pageMembers;
    } else {
      return pageMembers.filter((m) => m.rank === rank);
    }
  }, [pageMembers, rank]);
  const membersForTabs = [...filteredMembers, ...candidates];

  return (
    <FellowshipMembersLoadable>
      <FellowshipMemberCommon>
        <div className="flex items-center justify-between mb-4 pr-6">
          <FellowshipMemberTabs members={membersForTabs} />
          {component}
        </div>

        {hasMembers ? (
          <FellowshipCoreMemberCardListContainer>
            {filteredMembers.map((member) => (
              <FellowshipCoreMemberCard key={member.address} member={member} />
            ))}
          </FellowshipCoreMemberCardListContainer>
        ) : (
          <FellowshipMemberEmpty />
        )}
      </FellowshipMemberCommon>
    </FellowshipMembersLoadable>
  );
}
