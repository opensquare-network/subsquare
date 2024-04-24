import Bump from "next-common/components/fellowship/core/members/actions/bump";

export default function Actions({ member }) {
  // todo: add activeness setting menu
  return (
    <div className="leading-5 flex justify-between mt-6">
      <span className="text14Medium text-textPrimary">Actions</span>

      <span>
        <Bump member={member} />
      </span>
    </div>
  );
}
