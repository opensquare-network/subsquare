import Bump from "next-common/components/fellowship/core/members/actions/bump";
import Promote from "./promote";
import More from "./more";
import Approve from "./approve";

export default function Actions({ member }) {
  return (
    <div className="leading-5 flex justify-between mt-6">
      <div className="text14Medium text-textPrimary">Actions</div>

      <div className="flex gap-[16px]">
        <Bump member={member} />
        <Promote member={member} />
        <Approve member={member} />
        <More member={member} />
      </div>
    </div>
  );
}
