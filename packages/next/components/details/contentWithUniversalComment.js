import { usePost } from "next-common/context/post";
import { EditorProvider } from "next-common/context/post/editor";
import { CommentsProvider } from "next-common/context/post/comments";
import { usePageProps } from "next-common/context/page";
import { usePostCommentsData } from "next-common/hooks/usePostCommentsData";
import useCommentComponent from "next-common/components/useCommentComponent";

function ContentWithUniversalCommentImpl({ children }) {
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
