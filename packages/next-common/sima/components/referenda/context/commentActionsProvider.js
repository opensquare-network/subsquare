import CommentActionsContext from "next-common/sima/context/commentActions";
import {
  useCreateProposalComment,
  useCreateProposalCommentReply,
  useGetProposalComment,
} from "next-common/sima/actions/comment";

export function ReferendaCommentActionsContextProvider({ children }) {
  const getComment = useGetProposalComment();
  const createPostComment = useCreateProposalComment();
  const createCommentReply = useCreateProposalCommentReply();

  return (
    <CommentActionsContext.Provider
      value={{ getComment, createPostComment, createCommentReply }}
    >
      {children}
    </CommentActionsContext.Provider>
  );
}
