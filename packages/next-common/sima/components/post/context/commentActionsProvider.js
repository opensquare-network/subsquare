import CommentActionsContext from "next-common/sima/context/commentActions";
import {
  useCreateDiscussionComment,
  useCreateDiscussionCommentReply,
  useGetDiscussionComment,
} from "next-common/sima/actions/comment";

export function DiscussionCommentActionsContextProvider({ children }) {
  const getComment = useGetDiscussionComment();
  const createPostComment = useCreateDiscussionComment();
  const createCommentReply = useCreateDiscussionCommentReply();

  return (
    <CommentActionsContext.Provider
      value={{ getComment, createPostComment, createCommentReply }}
    >
      {children}
    </CommentActionsContext.Provider>
  );
}
