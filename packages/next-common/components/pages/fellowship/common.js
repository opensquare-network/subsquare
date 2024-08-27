import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { isSameAddress } from "next-common/utils";
import FellowshipCoreCommon from "next-common/components/fellowship/core/common";
import MyFellowshipMemberStatus from "next-common/components/fellowship/core/members/myStatus";
import { usePageProps } from "next-common/context/page";
import { ActiveReferendaProvider } from "next-common/context/activeReferenda";
import useFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFellowshipCoreMembers";

export default function FellowshipMemberCommon({ children }) {
  const { fellowshipParams } = usePageProps();
  const { members } = useFellowshipCoreMembers();
  const myAddress = useRealAddress();
  const mine = (members || []).find((member) =>
    isSameAddress(member.address, myAddress),
  );

  return (
    <ActiveReferendaProvider pallet="fellowshipReferenda">
      <FellowshipCoreCommon>
        <MyFellowshipMemberStatus member={mine} params={fellowshipParams} />
        {children}
      </FellowshipCoreCommon>
    </ActiveReferendaProvider>
  );
}
