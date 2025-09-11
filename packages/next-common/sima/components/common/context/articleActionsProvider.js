import ArticleActionsContext from "next-common/sima/context/articleActions";
import { useProposalUpVote } from "next-common/sima/actions/upVote";
import { useProposalCancelUpVote } from "next-common/sima/actions/cancelUpVote";
import { useProvideContext } from "next-common/sima/actions/provideContext";
import { useReloadPost } from "next-common/noSima/actions/reloadPost";
import { useGetSimaUserDiscussions } from "next-common/sima/actions/linkPost";

export function SimaProposalArticleActionsProvider({ children }) {
  const upVote = useProposalUpVote();
  const cancelUpVote = useProposalCancelUpVote();
  const reloadPost = useReloadPost();
  const provideContext = useProvideContext();
  const getUserDiscussions = useGetSimaUserDiscussions();

  return (
    <ArticleActionsContext.Provider
      value={{
        supportSima: true,
        provideContext,
        upVote,
        cancelUpVote,
        reloadPost,
        getUserDiscussions,
      }}
    >
      {children}
    </ArticleActionsContext.Provider>
  );
}
