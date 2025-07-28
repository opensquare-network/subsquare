import { CommentsProvider } from "next-common/context/post/comments";
import {
  SwitchCommentProvider,
  useSwitchCommentList,
} from "next-common/context/post/switchComment";
import { CommentsContent } from "./contentWithComment";
import { usePageProps } from "next-common/context/page";

export function SwitchCommentImpl({ children }) {
  const comments = useSwitchCommentList();
  return <CommentsProvider comments={comments}>{children}</CommentsProvider>;
}

export default function SwitchComment({ children }) {
  const { comments, evidenceComments } = usePageProps();

  const switchTabs = [
    {
      tabId: "referendum",
      tabTitle: "Referendum",
      comments,
    },
    {
      tabId: "evidence",
      tabTitle: "Evidence",
      comments: evidenceComments,
    },
  ];
  return (
    <SwitchCommentProvider switchTabs={switchTabs}>
      <SwitchCommentImpl>
        <CommentsContent>{children}</CommentsContent>
      </SwitchCommentImpl>
    </SwitchCommentProvider>
  );
}
