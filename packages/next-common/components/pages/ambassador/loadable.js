import { useSelector } from "react-redux";
import { ambassadorCoreMembersSelector } from "next-common/store/reducers/ambassador/core";
import { isNil } from "lodash-es";
import { SystemLoading } from "@osn/icons/subsquare";
import AmbassadorCoreCommon from "next-common/components/ambassador/core/common";

export default function AmbassadorMembersLoadable({ children }) {
  const members = useSelector(ambassadorCoreMembersSelector);
  if (isNil(members)) {
    return (
      <AmbassadorCoreCommon>
        <SystemLoading className="my-6 [&_path]:stroke-textTertiary mx-auto" />
      </AmbassadorCoreCommon>
    );
  }

  return children;
}
