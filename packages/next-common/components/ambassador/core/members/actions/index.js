import CoreFellowshipBump from "next-common/components/collectives/core/actions/bump";
import More from "next-common/components/collectives/core/actions/more";
import ViewDetailButton from "next-common/components/fellowship/core/members/actions/viewDetailButton";

export default function Actions({ member }) {
  return (
    <div className="leading-5 flex justify-between mt-6">
      <div className="text14Medium text-textPrimary">Actions</div>

      <div className="flex gap-[16px]">
        <CoreFellowshipBump member={member} />
        <ViewDetailButton address={member.address} />
        <More member={member} />
      </div>
    </div>
  );
}
