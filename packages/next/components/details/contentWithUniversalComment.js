import useUniversalComments from "components/universalComments";
import { usePost } from "next-common/context/post";
import { EditorProvider } from "next-common/context/post/editor";

export default function ContentWithUniversalComment({ children, comments }) {
  const detail = usePost();
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
