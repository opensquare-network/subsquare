import CommentActionsContext from "next-common/sima/context/commentActions";
import {
  useCreateProposalComment,
  useCreateProposalCommentReply,
} from "next-common/sima/actions/comment";
import { useProposalCommentUpVote } from "next-common/sima/actions/upVote";
import { useProposalCommentCancelUpVote } from "next-common/sima/actions/cancelUpVote";
import {
  useGetComment,
  useUpdateOffChainComment,
} from "next-common/noSima/actions/comment";

export function SimaProposalCommentActionsProvider({ children }) {
  const getComment = useGetComment();
  const createPostComment = useCreateProposalComment();
  const createCommentReply = useCreateProposalCommentReply();
  const upVoteComment = useProposalCommentUpVote();
  const cancelUpVoteComment = useProposalCommentCancelUpVote();
  const updateOffChainComment = useUpdateOffChainComment();

  return (
    <CommentActionsContext.Provider
      value={{
        supportSima: true,
        getComment,
        createPostComment,
        createCommentReply,
        upVoteComment,
        cancelUpVoteComment,
        updateComment: updateOffChainComment,
      }}
    >
      {children}
    </CommentActionsContext.Provider>
  );
}
