import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { isSameAddress } from "next-common/utils";
import AmbassadorCoreCommon from "next-common/components/ambassador/core/common";
import MyAmbassadorMemberStatus from "next-common/components/collectives/core/member/myStatus";
import { ActiveReferendaProvider } from "next-common/context/activeReferenda";
import useFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFellowshipCoreMembers";

export default function AmbassadorMemberCommon({ children, params }) {
  const { members } = useFellowshipCoreMembers();
  const myAddress = useRealAddress();
  const mine = (members || []).find((member) =>
    isSameAddress(member.address, myAddress),
  );

  return (
    <ActiveReferendaProvider pallet="ambassadorReferenda">
      <AmbassadorCoreCommon>
        <MyAmbassadorMemberStatus member={mine} params={params} />
        {children}
      </AmbassadorCoreCommon>
    </ActiveReferendaProvider>
  );
}
