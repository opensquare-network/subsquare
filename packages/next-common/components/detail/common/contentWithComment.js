import useCommentComponent from "next-common/components/useCommentComponent";
import { usePageProps } from "next-common/context/page";
import { usePost } from "next-common/context/post";
import {
  CommentsProvider,
  useComments,
} from "next-common/context/post/comments";
import { EditorProvider } from "next-common/context/post/editor";

function ContentWithCommentImpl({ children }) {
  const detail = usePost();
  const comments = useComments();
  const { CommentComponent, focusEditor } = useCommentComponent({
    detail,
    comments,
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
