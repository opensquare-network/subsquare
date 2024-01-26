import { usePageProps } from "next-common/context/page";
import useFetchFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFetchFellowshipCoreMembers";
import { useSelector } from "react-redux";
import { fellowshipCoreMembersSelector } from "next-common/store/reducers/fellowship/core";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { isSameAddress } from "next-common/utils";
import isNil from "lodash.isnil";
import FellowshipCoreCommon from "next-common/components/fellowship/core/common";
import { SystemLoading } from "@osn/icons/subsquare";
import MyFellowshipMemberStatus from "next-common/components/fellowship/core/members/myStatus";
import FellowshipMemberTabs from "next-common/components/fellowship/core/members/tabs";
import FellowshipCoreMemberCard from "next-common/components/fellowship/core/members/card";

export default function FellowshipMembersPage() {
  const { fellowshipMembers } = usePageProps();
  useFetchFellowshipCoreMembers(fellowshipMembers);
  const members = useSelector(fellowshipCoreMembersSelector);
  const myAddress = useRealAddress();
  const mine = (members || []).find((member) =>
    isSameAddress(member.address, myAddress),
  );

  if (isNil(members)) {
    return (
      <FellowshipCoreCommon>
        <SystemLoading className="[&_path]:stroke-textTertiary mx-auto" />
      </FellowshipCoreCommon>
    );
  }

  return (
    <FellowshipCoreCommon>
      <MyFellowshipMemberStatus member={mine} />
      <FellowshipMemberTabs members={members} />
      <div className="flex flex-col gap-y-4">
        {(members || []).map((member) => {
          return (
            <FellowshipCoreMemberCard key={member.address} member={member} />
          );
        })}
      </div>
    </FellowshipCoreCommon>
  );
}
