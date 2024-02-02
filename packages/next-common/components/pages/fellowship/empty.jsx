import { SystemMember } from "@osn/icons/subsquare";
import NoData from "next-common/components/noData";

export default function FellowshipMembersEmpty() {
  return (
    <NoData
      icon={<SystemMember className="[&_path]:stroke-textTertiary" />}
      text="There are no members here"
    />
  );
}
