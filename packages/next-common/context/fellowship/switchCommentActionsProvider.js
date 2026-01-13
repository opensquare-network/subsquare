import { useSwitchCommentTabs } from "next-common/context/post/switchComment";
import CommentActionsContext from "next-common/sima/context/commentActions";
import {
  useCreateProposalComment,
  useCreateProposalCommentReply,
  useReplaceProposalComment,
} from "next-common/sima/actions/comment";
import { useDeleteProposalComment } from "next-common/sima/actions/deleteComment";
import { useProposalCommentUpVote } from "next-common/sima/actions/upVote";
import { useProposalCommentCancelUpVote } from "next-common/sima/actions/cancelUpVote";
import { useGetComment } from "next-common/noSima/actions/comment";
import MaybeSimaContent from "next-common/components/detail/maybeSimaContent";
import { useEvidenceCommentActions } from "./simaEvidencesCommentActionsProvider";
import { useMemo } from "react";
import { SimaProposalArticleActionsProvider } from "next-common/sima/components/common/context/articleActionsProvider";
import { GeneralProxiesProvider } from "../proxy";
import { usePageProps } from "../page";

export default function SwitchCommentActionsProvider({ children }) {
  const { activeTab } = useSwitchCommentTabs();
  const getComment = useGetComment();
  const createPostComment = useCreateProposalComment();
  const createCommentReply = useCreateProposalCommentReply();
  const upVoteComment = useProposalCommentUpVote();
  const cancelUpVoteComment = useProposalCommentCancelUpVote();
  const updateComment = useReplaceProposalComment();
  const deleteComment = useDeleteProposalComment();
  const { evidence } = usePageProps();

  const evidenceActions = useEvidenceCommentActions(evidence);

  const fellowshipReferendaActions = useMemo(() => {
    return {
      supportSima: true,
      getComment,
      createPostComment,
      createCommentReply,
      upVoteComment,
      cancelUpVoteComment,
      updateComment,
      deleteComment,
    };
  }, [
    getComment,
    createPostComment,
    createCommentReply,
    upVoteComment,
    cancelUpVoteComment,
    updateComment,
    deleteComment,
  ]);

  const actions = useMemo(() => {
    if (activeTab === "evidence") {
      return evidenceActions;
    }
    return fellowshipReferendaActions;
  }, [activeTab, evidenceActions, fellowshipReferendaActions]);

  if (activeTab) {
    return (
      <SimaProposalArticleActionsProvider>
        <CommentActionsContext.Provider value={actions}>
          <GeneralProxiesProvider>{children}</GeneralProxiesProvider>
        </CommentActionsContext.Provider>
      </SimaProposalArticleActionsProvider>
    );
  }

  return <MaybeSimaContent>{children}</MaybeSimaContent>;
}
