import CommentActionsContext from "next-common/sima/context/commentActions";
import {
  useCreateOffChainComment,
  useCreateOffChainCommentReply,
  useGetComment,
  useUpdateOffChainComment,
} from "../actions/comment";
import { useOffChainCommentUpVote } from "../actions/upVote";
import { useOffChainCommentCancelUpVote } from "../actions/cancelUpVote";
import { useDeleteOffChainComment } from "../actions/deleteComment";

export function OffChainCommentActionsProvider({ children }) {
  const getComment = useGetComment();
  const updateComment = useUpdateOffChainComment();
  const createPostComment = useCreateOffChainComment();
  const createCommentReply = useCreateOffChainCommentReply();
  const upVoteComment = useOffChainCommentUpVote();
  const cancelUpVoteComment = useOffChainCommentCancelUpVote();
  const deleteComment = useDeleteOffChainComment();

  return (
    <CommentActionsContext.Provider
      value={{
        supportSima: false,
        getComment,
        updateComment,
        createPostComment,
        createCommentReply,
        upVoteComment,
        cancelUpVoteComment,
        deleteComment,
      }}
    >
      {children}
    </CommentActionsContext.Provider>
  );
}
