import AmbassadorCoreMemberCard from "next-common/components/ambassador/core/members/card";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { isSameAddress } from "next-common/utils";
import useFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFellowshipCoreMembers";
import { usePageProps } from "next-common/context/page";

export default function MyAmbassadorMemberCard() {
  const { ambassadorParams } = usePageProps();
  const { members } = useFellowshipCoreMembers();
  const myAddress = useRealAddress();
  const mine = (members || []).find((member) =>
    isSameAddress(member.address, myAddress),
  );

  if (!mine) {
    return null;
  }

  return <AmbassadorCoreMemberCard member={mine} params={ambassadorParams} />;
}
