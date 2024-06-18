import useCommentComponent from "next-common/components/useCommentComponent";
import { usePageProps } from "next-common/context/page";
import { CommentsProvider } from "next-common/context/post/comments";
import { EditorProvider } from "next-common/context/post/editor";

function ContentWithCommentImpl({ children }) {
  const { component, focusEditor } = useCommentComponent();

  return (
    <EditorProvider focusEditor={focusEditor}>
      {children}
      {component}
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
