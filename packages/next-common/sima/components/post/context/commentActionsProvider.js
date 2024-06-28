import CommentActionsContext from "next-common/sima/context/commentActions";
import {
  useCreateDiscussionComment,
  useCreateDiscussionCommentReply,
  useGetDiscussionComment,
} from "next-common/sima/actions/comment";
import { useDiscussionCommentUpVote } from "next-common/sima/actions/upVote";
import { useDiscussionCommentCancelUpVote } from "next-common/sima/actions/cancelUpVote";

export function DiscussionCommentActionsContextProvider({ children }) {
  const getComment = useGetDiscussionComment();
  const createPostComment = useCreateDiscussionComment();
  const createCommentReply = useCreateDiscussionCommentReply();
  const upVoteComment = useDiscussionCommentUpVote();
  const cancelUpVoteComment = useDiscussionCommentCancelUpVote();

  return (
    <CommentActionsContext.Provider
      value={{
        getComment,
        createPostComment,
        createCommentReply,
        upVoteComment,
        cancelUpVoteComment,
      }}
    >
      {children}
    </CommentActionsContext.Provider>
  );
}
