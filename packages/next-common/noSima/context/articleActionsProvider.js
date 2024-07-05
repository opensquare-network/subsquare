import ArticleActionsContext from "next-common/sima/context/articleActions";
import { useOffChainProvideContext } from "../actions/provideContext";
import { useReloadPost } from "../actions/reloadPost";
import { useOffChainPostUpVote } from "../actions/upVote";
import { useOffChainPostCancelUpVote } from "../actions/cancelUpVote";
import { useGetUserDiscussions } from "../actions/linkPost";

export function OffChainArticleActionsProvider({ children }) {
  const upVote = useOffChainPostUpVote();
  const cancelUpVote = useOffChainPostCancelUpVote();
  const reloadPost = useReloadPost();
  const provideContext = useOffChainProvideContext();
  const getUserDiscussions = useGetUserDiscussions();

  return (
    <ArticleActionsContext.Provider
      value={{
        provideContext,
        reloadPost,
        upVote,
        cancelUpVote,
        getUserDiscussions,
      }}
    >
      {children}
    </ArticleActionsContext.Provider>
  );
}
