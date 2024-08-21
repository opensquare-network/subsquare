import { isNil } from "lodash-es";
import FellowshipCoreCommon from "next-common/components/fellowship/core/common";
import { SystemLoading } from "@osn/icons/subsquare";
import useFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFellowshipCoreMembers";

export default function FellowshipMembersLoadable({ children }) {
  const { members, loading } = useFellowshipCoreMembers();

  if (loading || isNil(members)) {
    return (
      <FellowshipCoreCommon>
        <SystemLoading className="my-6 [&_path]:stroke-textTertiary mx-auto" />
      </FellowshipCoreCommon>
    );
  }

  return children;
}
