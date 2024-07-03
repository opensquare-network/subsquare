import CommentActionsContext from "next-common/sima/context/commentActions";
import {
  useCreateDiscussionComment,
  useCreateDiscussionCommentReply,
} from "next-common/sima/actions/comment";
import { useDiscussionCommentUpVote } from "next-common/sima/actions/upVote";
import { useDiscussionCommentCancelUpVote } from "next-common/sima/actions/cancelUpVote";
import { useGetOffChainComment } from "next-common/noSima/actions/comment";

export function DiscussionCommentActionsContextProvider({ children }) {
  const getComment = useGetOffChainComment();
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
