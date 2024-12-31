import FellowshipCoreMemberCard from "next-common/components/fellowship/core/members/card";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { isSameAddress } from "next-common/utils";
import useFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFellowshipCoreMembers";
import { usePageProps } from "next-common/context/page";

export default function MyFellowshipMemberCard() {
  const { fellowshipParams } = usePageProps();
  const { members } = useFellowshipCoreMembers();
  const myAddress = useRealAddress();
  const member = (members || []).find((member) =>
    isSameAddress(member.address, myAddress),
  );

  if (!member) {
    return null;
  }

  return <FellowshipCoreMemberCard member={member} params={fellowshipParams} />;
}
