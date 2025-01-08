import CoreFellowshipPromote from "./promote";
import CoreFellowshipApprove from "./approve";
import CoreFellowshipBump from "next-common/components/collectives/core/actions/bump";
import More from "next-common/components/collectives/core/actions/more";

export default function Actions({ member }) {
  return (
    <div className="leading-5 flex justify-end mt-6">
      <div className="flex gap-[16px]">
        <CoreFellowshipBump member={member} />
        <CoreFellowshipPromote member={member} />
        <CoreFellowshipApprove member={member} />
        <More member={member} />
      </div>
    </div>
  );
}
