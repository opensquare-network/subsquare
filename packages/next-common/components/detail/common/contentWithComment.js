import useCommentComponent from "next-common/components/useCommentComponent";
import { usePost } from "next-common/context/post";
import { EditorProvider } from "next-common/context/post/editor";

export default function ContentWithComment({ children, comments }) {
  const detail = usePost();
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
