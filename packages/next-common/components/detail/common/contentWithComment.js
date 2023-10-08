import useCommentComponent from "next-common/components/useCommentComponent";
import { usePageProps } from "next-common/context/page";
import { usePost } from "next-common/context/post";
import { CommentsProvider } from "next-common/context/post/comments";
import { EditorProvider } from "next-common/context/post/editor";
import { usePostCommentsData } from "next-common/hooks/usePostCommentsData";

function ContentWithCommentImpl({ children }) {
  const detail = usePost();
  const { commentsData } = usePostCommentsData();
  const { CommentComponent, focusEditor } = useCommentComponent({
    detail,
    comments: commentsData,
  });

  return (
    <EditorProvider focusEditor={focusEditor}>
      {children}
      {CommentComponent}
    </EditorProvider>
  );
}

export default function ContentWithComment({ children }) {
  const { comments } = usePageProps();
  return (
    <CommentsProvider comments={comments}>
      <ContentWithCommentImpl>{children}</ContentWithCommentImpl>
    </CommentsProvider>
  );
}
