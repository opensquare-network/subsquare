import useCommentComponent from "next-common/components/useCommentComponent";
import { useDetailType, usePageProps } from "next-common/context/page";
import { CommentsProvider } from "next-common/context/post/comments";
import { EditorProvider } from "next-common/context/post/editor";
import { usePostCommentsData } from "next-common/hooks/usePostComments";
import { usePostCommentsFilteredData } from "next-common/hooks/usePostCommentsFilteredData";
import { detailPageCategory } from "next-common/utils/consts/business/category";

function CommentsWithFilterContent({ children }) {
  const { commentsData, loading } = usePostCommentsFilteredData();
  const { CommentComponent, focusEditor } = useCommentComponent({
    commentsData,
    loading,
  });

  return (
    <EditorProvider focusEditor={focusEditor}>
      {children}
      {CommentComponent}
    </EditorProvider>
  );
}

function CommentsContent({ children }) {
  const { commentsData, loading } = usePostCommentsData();
  const { CommentComponent, focusEditor } = useCommentComponent({
    commentsData,
    loading,
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
  const detailType = useDetailType();

  let content;
  if (
    detailType === detailPageCategory.GOV2_REFERENDUM ||
    detailType === detailPageCategory.DEMOCRACY_REFERENDUM
  ) {
    content = <CommentsWithFilterContent>{children}</CommentsWithFilterContent>;
  } else {
    content = <CommentsContent>{children}</CommentsContent>;
  }

  return <CommentsProvider comments={comments}>{content}</CommentsProvider>;
}
