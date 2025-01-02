import FellowshipCoreCommon from "next-common/components/fellowship/core/common";
import { ActiveReferendaProvider } from "next-common/context/activeReferenda";

export default function FellowshipMemberCommon({ children }) {
  return (
    <ActiveReferendaProvider pallet="fellowshipReferenda">
      <FellowshipCoreCommon>{children}</FellowshipCoreCommon>
    </ActiveReferendaProvider>
  );
}
