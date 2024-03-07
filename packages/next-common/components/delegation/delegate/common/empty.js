import { SystemMember } from "@osn/icons/subsquare";
import NoData from "next-common/components/noData";

export default function DelegateEmpty() {
  return (
    <NoData
      icon={<SystemMember className="[&_path]:stroke-textTertiary" />}
      text="No delegates"
    />
  );
}
