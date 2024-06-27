import AmbassadorMembersLoadable from "next-common/components/pages/ambassador/loadable";
import AmbassadorCoreCommon from "next-common/components/ambassador/core/common";

export default function AmbassadorCoreMembersPage() {
  return (
    <AmbassadorMembersLoadable>
      <AmbassadorCoreCommon></AmbassadorCoreCommon>
    </AmbassadorMembersLoadable>
  );
}
