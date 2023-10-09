import { EditorProvider } from "next-common/context/post/editor";
import { CommentsProvider } from "next-common/context/post/comments";
import { usePageProps } from "next-common/context/page";
import useCommentComponent from "next-common/components/useCommentComponent";

function ContentWithUniversalCommentImpl({ children }) {
  const { CommentComponent, focusEditor } = useCommentComponent();

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
