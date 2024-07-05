import Promote from "./promote";
import Approve from "./approve";
import CoreFellowshipBump from "next-common/components/collectives/core/actions/bump";
import More from "next-common/components/collectives/core/actions/more";

export default function Actions({ member }) {
  return (
    <div className="leading-5 flex justify-between mt-6">
      <div className="text14Medium text-textPrimary">Actions</div>

      <div className="flex gap-[16px]">
        <CoreFellowshipBump member={member} />
        <Promote member={member} />
        <Approve member={member} />
        <More member={member} />
      </div>
    </div>
  );
}
