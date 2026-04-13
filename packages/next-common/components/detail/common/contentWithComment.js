import {
  emptyFilterValues,
  defaultFilterValues,
  discussionEmptyFilterValues,
  discussionDefaultFilterValues,
} from "next-common/components/comment/filter";
import { DropdownUrlFilterProvider } from "next-common/components/dropdownFilter/context";
import useCommentComponent from "next-common/components/useCommentComponent";
import { useDetailType, usePageProps } from "next-common/context/page";
import { usePost } from "next-common/context/post";
import { CommentsProvider } from "next-common/context/post/comments";
import { EditorProvider } from "next-common/context/post/editor";
import { PolkassemblyCommentRepliesProvider } from "next-common/hooks/polkassembly/usePolkassemblyCommentReply";
import { usePostCommentsData } from "next-common/hooks/usePostComments";
import { usePostCommentsFilteredData } from "next-common/hooks/usePostCommentsFilteredData";
import { usePostCommentsSimpleFilteredData } from "next-common/hooks/usePostCommentsSimpleFilteredData";
import { detailPageCategory } from "next-common/utils/consts/business/category";

function CommentsWithFilterContent({ children }) {
  const { commentsData, loading } = usePostCommentsFilteredData();
  const { component, focusEditor } = useCommentComponent({
    commentsData,
    loading,
  });

  return (
    <EditorProvider focusEditor={focusEditor}>
      {children}
      {component}
    </EditorProvider>
  );
}

function DiscussionCommentsWithFilterContent({ children }) {
  const { commentsData, loading } = usePostCommentsSimpleFilteredData();
  const { component, focusEditor } = useCommentComponent({
    commentsData,
    loading,
  });

  return (
    <EditorProvider focusEditor={focusEditor}>
      {children}
      {component}
    </EditorProvider>
  );
}

export function CommentsContent({ children }) {
  const { commentsData, loading } = usePostCommentsData();
  const { component, focusEditor } = useCommentComponent({
    commentsData,
    loading,
  });

  return (
    <EditorProvider focusEditor={focusEditor}>
      {children}
      {component}
    </EditorProvider>
  );
}

export default function ContentWithComment({ children }) {
  const { comments } = usePageProps();
  const detailType = useDetailType();
  const post = usePost();

  const isReferendum =
    detailType === detailPageCategory.GOV2_REFERENDUM ||
    detailType === detailPageCategory.DEMOCRACY_REFERENDUM;

  let content;
  if (isReferendum) {
    content = (
      <DropdownUrlFilterProvider
        defaultFilterValues={defaultFilterValues}
        emptyFilterValues={emptyFilterValues}
      >
        <CommentsWithFilterContent>{children}</CommentsWithFilterContent>
      </DropdownUrlFilterProvider>
    );
  } else {
    content = (
      <DropdownUrlFilterProvider
        defaultFilterValues={discussionDefaultFilterValues}
        emptyFilterValues={discussionEmptyFilterValues}
      >
        <DiscussionCommentsWithFilterContent>
          {children}
        </DiscussionCommentsWithFilterContent>
      </DropdownUrlFilterProvider>
    );
  }

  return (
    <CommentsProvider comments={comments}>
      <PolkassemblyCommentRepliesProvider
        polkassemblyId={post.polkassemblyId}
        polkassemblyPostType={post.polkassemblyPostType}
      >
        {content}
      </PolkassemblyCommentRepliesProvider>
    </CommentsProvider>
  );
}
