import useUniversalComments from "components/universalComments";
import { usePost } from "next-common/context/post";
import { EditorProvider } from "next-common/context/post/editor";
import {
  CommentsProvider,
  useComments,
} from "next-common/context/post/comments";
import { usePageProps } from "next-common/context/page";

function ContentWithUniversalCommentImpl({ children }) {
  const detail = usePost();
  const comments = useComments();
  const { CommentComponent, focusEditor } = useUniversalComments({
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

export default function ContentWithUniversalComment({ children }) {
  const { comments } = usePageProps();
  return (
    <CommentsProvider comments={comments}>
      <ContentWithUniversalCommentImpl>
        {children}
      </ContentWithUniversalCommentImpl>
    </CommentsProvider>
  );
}
