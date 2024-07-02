import CommentActionsContext from "next-common/sima/context/commentActions";
import {
  useCreateProposalComment,
  useCreateProposalCommentReply,
} from "next-common/sima/actions/comment";
import { useProposalCommentUpVote } from "next-common/sima/actions/upVote";
import { useProposalCommentCancelUpVote } from "next-common/sima/actions/cancelUpVote";
import {
  useCreateOffChainCommentReply,
  useGetOffChainComment,
} from "next-common/noSima/actions/comment";

export function ReferendaCommentActionsContextProvider({ children }) {
  const getComment = useGetOffChainComment();
  const createPostComment = useCreateProposalComment();
  const createCommentReply = useCreateProposalCommentReply();
  const upVoteComment = useProposalCommentUpVote();
  const cancelUpVoteComment = useProposalCommentCancelUpVote();
  const createOffChainCommentReply = useCreateOffChainCommentReply();

  return (
    <CommentActionsContext.Provider
      value={{
        getComment,
        createPostComment,
        createCommentReply,
        createOffChainCommentReply,
        upVoteComment,
        cancelUpVoteComment,
      }}
    >
      {children}
    </CommentActionsContext.Provider>
  );
}
