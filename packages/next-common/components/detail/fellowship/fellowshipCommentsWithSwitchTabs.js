import { CommentsProvider } from "next-common/context/post/comments";
import {
  SwitchCommentProvider,
  useSwitchCommentList,
} from "next-common/context/post/switchComment";
import { usePageProps } from "next-common/context/page";

export function SwitchCommentImpl({ children }) {
  const comments = useSwitchCommentList();
  return <CommentsProvider comments={comments}>{children}</CommentsProvider>;
}

function formatTabTitle(text = "", total = 0) {
  if (total > 0) {
    return (
      <div className="flex items-center gap-1">
        {text} <span className="text-textTertiary">·</span>{" "}
        <span className="total">{total}</span>
      </div>
    );
  }
  return text;
}

export default function FellowshipCommentsWithSwitchTabs({ children }) {
  const { comments, evidenceComments } = usePageProps();

  const switchTabs = [
    {
      tabId: "referendum",
      tabTitle: formatTabTitle("Referendum", comments?.total),
      comments,
    },
    {
      tabId: "evidence",
      tabTitle: formatTabTitle("Evidence", evidenceComments?.total),
      comments: evidenceComments,
    },
  ];
  return (
    <SwitchCommentProvider switchTabs={switchTabs}>
      <SwitchCommentImpl>{children}</SwitchCommentImpl>
    </SwitchCommentProvider>
  );
}
