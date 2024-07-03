import ArticleActionsContext from "next-common/sima/context/articleActions";
import { useOffChainProvideContext } from "../actions/provideContext";
import { useReloadOffChainPost } from "../actions/reloadPost";
import { useOffChainPostUpVote } from "../actions/upVote";
import { useOffChainPostCancelUpVote } from "../actions/cancelUpVote";

export function OffChainArticleActionsContextProvider({ children }) {
  const upVote = useOffChainPostUpVote();
  const cancelUpVote = useOffChainPostCancelUpVote();
  const reloadPost = useReloadOffChainPost();
  const provideContext = useOffChainProvideContext();

  return (
    <ArticleActionsContext.Provider
      value={{
        provideContext,
        reloadPost,
        upVote,
        cancelUpVote,
      }}
    >
      {children}
    </ArticleActionsContext.Provider>
  );
}
