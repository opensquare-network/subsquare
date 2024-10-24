import PrimaryButton from "next-common/lib/button/primary";
import SplitProxyMenuButton from "./splitProxyMenuButton";

export default function MaybeSplitCommentButton({
  isSima = false,
  disabled,
  loading,
  isEdit,
  isReply,
  onClickComment,
  onClickCommentAsProxy,
}) {
  const action = isEdit ? "Update" : isReply ? "Reply" : "Comment";

  if (isSima) {
    return (
      <SplitProxyMenuButton
        action={action}
        loading={loading}
        disabled={disabled}
        onClick={onClickComment}
        onClickAsProxy={onClickCommentAsProxy}
      />
    );
  }

  return (
    <PrimaryButton
      loading={loading}
      disabled={disabled}
      onClick={onClickComment}
    >
      {action}
    </PrimaryButton>
  );
}
