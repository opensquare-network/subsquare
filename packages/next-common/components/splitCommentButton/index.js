import { SystemComment } from "@osn/icons/subsquare";
import SplitMenuButton from "../splitMenuButton";

export default function SplitCommentButton({
  action,
  onClickComment,
  onClickCommentAsProxy,
  ...props
}) {
  return (
    <SplitMenuButton
      {...props}
      onClick={onClickComment}
      dropdownMenuItems={[
        {
          icon: (
            <SystemComment
              className="[&_path]:stroke-textSecondary"
              width={24}
              height={24}
            />
          ),
          label: `${action} as a proxy`,
          onClick: onClickCommentAsProxy,
        },
      ]}
    >
      {action}
    </SplitMenuButton>
  );
}
