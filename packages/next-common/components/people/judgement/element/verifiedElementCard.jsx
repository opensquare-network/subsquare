import { PositiveTag } from "next-common/components/tags/state/styled";
import ElementCardHeader from "./elementCardHeader";
import ElementAccountRow from "./elementAccountRow";

export default function VerifiedElementCard({ elementAccount }) {
  return (
    <div className="w-full space-y-2 text14Medium text-textPrimary">
      <ElementCardHeader tag={<PositiveTag>Verified</PositiveTag>} />

      <ElementAccountRow elementAccount={elementAccount} />
    </div>
  );
}
