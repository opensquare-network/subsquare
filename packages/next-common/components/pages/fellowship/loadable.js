import { useSelector } from "react-redux";
import { fellowshipCoreMembersSelector } from "next-common/store/reducers/fellowship/core";
import isNil from "lodash.isnil";
import FellowshipCoreCommon from "next-common/components/fellowship/core/common";
import { SystemLoading } from "@osn/icons/subsquare";

export default function FellowshipMembersLoadable({ children }) {
  const members = useSelector(fellowshipCoreMembersSelector);
  if (isNil(members)) {
    return (
      <FellowshipCoreCommon>
        <SystemLoading className="[&_path]:stroke-textTertiary mx-auto" />
      </FellowshipCoreCommon>
    );
  }

  return children;
}
