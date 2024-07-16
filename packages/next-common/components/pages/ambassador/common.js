import { useSelector } from "react-redux";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { isSameAddress } from "next-common/utils";
import { ambassadorCoreMembersSelector } from "next-common/store/reducers/ambassador/core";
import AmbassadorCoreCommon from "next-common/components/ambassador/core/common";
import MyAmbassadorMemberStatus from "next-common/components/collectives/core/member/myStatus";
import { ActiveReferendaProvider } from "next-common/context/activeReferenda";

export default function AmbassadorMemberCommon({ children, params }) {
  const members = useSelector(ambassadorCoreMembersSelector);
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
