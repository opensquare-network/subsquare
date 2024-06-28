import CommentActionsContext from "next-common/sima/context/commentActions";
import {
  useCreateProposalComment,
  useCreateProposalCommentReply,
  useGetProposalComment,
} from "next-common/sima/actions/comment";
import { useProposalCommentUpVote } from "next-common/sima/actions/upVote";
import { useProposalCommentCancelUpVote } from "next-common/sima/actions/cancelUpVote";

export function ReferendaCommentActionsContextProvider({ children }) {
  const getComment = useGetProposalComment();
  const createPostComment = useCreateProposalComment();
  const createCommentReply = useCreateProposalCommentReply();
  const upVoteComment = useProposalCommentUpVote();
  const cancelUpVoteComment = useProposalCommentCancelUpVote();

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
