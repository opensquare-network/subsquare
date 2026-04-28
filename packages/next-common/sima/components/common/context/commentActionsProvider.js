import CommentActionsContext from "next-common/sima/context/commentActions";
import {
  useCreateProposalComment,
  useCreateProposalCommentReply,
  useReplaceProposalComment,
} from "next-common/sima/actions/comment";
import { useDeleteProposalComment } from "next-common/sima/actions/deleteComment";
import { useProposalCommentUpVote } from "next-common/sima/actions/upVote";
import { useProposalCommentCancelUpVote } from "next-common/sima/actions/cancelUpVote";
import { useProposalCommentDownVote } from "next-common/sima/actions/downVote";
import { useProposalCommentCancelDownVote } from "next-common/sima/actions/cancelDownVote";
import { useGetComment } from "next-common/noSima/actions/comment";

export function SimaProposalCommentActionsProvider({ children }) {
  const getComment = useGetComment();
  const createPostComment = useCreateProposalComment();
  const createCommentReply = useCreateProposalCommentReply();
  const upVoteComment = useProposalCommentUpVote();
  const cancelUpVoteComment = useProposalCommentCancelUpVote();
  const downVoteComment = useProposalCommentDownVote();
  const cancelDownVoteComment = useProposalCommentCancelDownVote();
  const updateComment = useReplaceProposalComment();
  const deleteComment = useDeleteProposalComment();

  return (
    <CommentActionsContext.Provider
      value={{
        supportSima: true,
        getComment,
        createPostComment,
        createCommentReply,
        upVoteComment,
        cancelUpVoteComment,
        downVoteComment,
        cancelDownVoteComment,
        updateComment,
        deleteComment,
      }}
    >
      {children}
    </CommentActionsContext.Provider>
  );
}
