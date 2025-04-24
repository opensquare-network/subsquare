import FellowshipCoreCommon from "next-common/components/fellowship/core/common";
import CollectivesMembersProvider from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/collectivesMember";
import { ActiveReferendaProvider } from "next-common/context/activeReferenda";

export default function FellowshipMemberCommon({ children }) {
  return (
    <ActiveReferendaProvider pallet="fellowshipReferenda">
      <CollectivesMembersProvider>
        <FellowshipCoreCommon>{children}</FellowshipCoreCommon>
      </CollectivesMembersProvider>
    </ActiveReferendaProvider>
  );
}
