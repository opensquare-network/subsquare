import Bump from "next-common/components/fellowship/core/members/actions/bump";
import Promote from "./promote";

export default function Actions({ member }) {
  return (
    <div className="leading-5 flex justify-between mt-6">
      <span className="text14Medium text-textPrimary">Actions</span>

      <div className="flex gap-[16px]">
        <span>
          <Bump member={member} />
        </span>
        <span>
          <Promote member={member} />
        </span>
      </div>
    </div>
  );
}
