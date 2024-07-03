import CommentActionsContext from "next-common/sima/context/commentActions";
import {
  useCreateOffChainComment,
  useCreateOffChainCommentReply,
  useGetOffChainComment,
  useUpdateOffChainComment,
} from "../actions/comment";
import { useOffChainCommentUpVote } from "../actions/upVote";
import { useOffChainCommentCancelUpVote } from "../actions/cancelUpVote";

export function OffChainCommentActionsProvider({ children }) {
  const getComment = useGetOffChainComment();
  const updateComment = useUpdateOffChainComment();
  const createPostComment = useCreateOffChainComment();
  const createCommentReply = useCreateOffChainCommentReply();
  const upVoteComment = useOffChainCommentUpVote();
  const cancelUpVoteComment = useOffChainCommentCancelUpVote();

  return (
    <CommentActionsContext.Provider
      value={{
        getComment,
        updateComment,
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
