import AmbassadorCoreCommon from "next-common/components/ambassador/core/common";
import { ActiveReferendaProvider } from "next-common/context/activeReferenda";

export default function AmbassadorMemberCommon({ children }) {
  return (
    <ActiveReferendaProvider pallet="fellowshipReferenda">
      <AmbassadorCoreCommon>{children}</AmbassadorCoreCommon>
    </ActiveReferendaProvider>
  );
}
